/**
 * 多进程集群服务
 */
'use strict';


const cluster = require('cluster');
const net = require('net');
const stick = require('./lib/core');
const msgCenter = require('./lib/msgCenter');
const {
    anSign,
    anVerify,
    anPrivateEncrypt,
    anPublicDecrypt,
    anPublicEncrypt,
    anPrivateDecrypt
} = require('./ancrypto');

const {
    connectLogServer,
    log_info,
    log_debug,
    log_trace,
    log_warn,
    log_error,
    log_fatal
} = require('./log_client.js');

const listen_port = 9595;

const numCPUS = require('os').cpus().length;

process.on('SIGINT', () => {
    console.log(`app Received SIGINT.  process:${process.pid} exit(1).`);

    process.exit(1);
});

if (cluster.isMaster) {
    //启动日志服务
    connectLogServer();

    log_debug(`master-${process.pid} start..., cpus=${numCPUS}`);
    console.log(`master-${process.pid} start..., cpus=${numCPUS}`);

    for (let i = 0; i < numCPUS; ++i) {
        cluster.fork();
    }

    cluster.on('fork', (worker) => {
        console.log(`master fork worker : ${worker.id}, ${worker.process.pid}`);
        log_debug(`master fork worker : ${worker.id}, ${worker.process.pid}`);
    });

    cluster.on('online', (worker) => {
        console.log(`worker : ${worker.id}, ${worker.process.pid} online.`);
        log_info(`worker : ${worker.id}, ${worker.process.pid} online.`);
    });

    cluster.on('listening', (worker, address) => {
        console.log(`${process.pid}===listening:worker:${worker.process.pid}, \
            address:${address.address} : ${address.port}`);

        log_info(`${process.pid}===listening:worker:${worker.process.pid}, \
            address:${address.address} : ${address.port}`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`${process.pid}===worker : \
            ${worker.process.pid} recv ${signal} exited(${code}).`);

        log_info(`${process.pid}===worker : \
            ${worker.process.pid} recv ${signal} exited(${code}).`);
    });

} else if (cluster.isWorker) {
    const tcp_server = net.createServer(function (socket) {
        log_info(`${process.pid}===recv ${socket.remoteAddress} - ${socket.remotePort} connected...`);
        console.log(`${process.pid}===recv ${socket.remoteAddress} - ${socket.remotePort} connected...`);
        socket.setNoDelay(true);
        const msgBuffer = new msgCenter();

        socket.on('data', data => {
            console.log(`${process.pid}===recv raw data: ${data}`);
            log_info(`${process.pid}===recv raw data: ${data}`);
            //收到数据并组包
            msgBuffer.putData(data);
        });

        socket.on('close', () => {
            console.log(`${process.pid}===${socket.remoteAddress} client disconnected.`);
            log_info(`${process.pid}===${socket.remoteAddress} client disconnected.`);
        });

        socket.on('error', error => {
            console.log(`${process.pid}===error:${socket.remoteAddress}异常断开: ${error}`)
            log_info(`${process.pid}===error:${socket.remoteAddress}异常断开: ${error}`);
        });

        socket.on('end', () => {
            console.log(`${process.pid}===${socket.remoteAddress} end.`);
            log_info(`${process.pid}===${socket.remoteAddress} end.`);
        });

        //收到分包数据的处理（）
        msgBuffer.onMsgRecv(function (data) {
            //加密
            let cipher = anPrivateEncrypt(data);

            //返写加密数据
            socket.write(cipher);
            console.log(`${process.pid}===socket.write anPrivateEncrypt : ${cipher.toString('base64')}`);
            log_info(`${process.pid}===socket.write anPrivateEncrypt : ${cipher.toString('base64')}`);
            //结束
            socket.end();
        });
    });

    tcp_server.on('error', err => {
        console.log(err);
        log_info(err);
    });
    tcp_server.listen(listen_port, () => {
        console.log(`${process.pid}===tcp_server listening on ${listen_port}...`);
        log_debug(`${process.pid}===tcp_server listening on ${listen_port}...`);
    });
};
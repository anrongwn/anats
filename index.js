/**
 * 单进程服务
 */
'use strict';

const net = require('net');
const stick = require('./lib/core');
const msgCenter = require('./lib/msgCenter');
const log4js = require('log4js');
const log4js_config = require('./logs/log4js.json');
log4js.configure(log4js_config);

const {
    anSign,
    anVerify,
    anPrivateEncrypt,
    anPublicDecrypt,
    anPublicEncrypt,
    anPrivateDecrypt
} = require('./ancrypto');
const listen_port = 9595;

/*
module.exports = {
    stick,
    msgCenter
}
*/

let log = log4js.getLogger('date_log');
function test() {
    //console.log('anats start...');
    let data = 'vvv';
    let sig = anSign(data);

    //console.log(`sig = ${sig}`);

    let cipher = anPrivateEncrypt(Buffer.from(data));
    //console.log(`cipher = ${cipher.toString('base64')}`);

    let data1 = 'svv'
    let issig = anVerify(data, sig);
    //console.log(issig);

    let plain = anPublicDecrypt(cipher);
    //console.log(`plain = ${plain.toString()}`);
};

//
//test();

process.on('SIGINT', () => {
    //console.log('Received SIGINT.  application exit(1).');
    log.info('Received SIGINT.  application exit(1).');
    process.exit(1);
});

const tcp_server = net.createServer(function(socket){
    //console.log(`===recv ${socket.remoteAddress} - ${socket.remotePort} connected...`);
    log.info(`===recv ${socket.remoteAddress} - ${socket.remotePort} connected...`);
    socket.setNoDelay(true);
    const msgBuffer = new msgCenter();

    socket.on('data', data=>{
        //console.log('recv raw data: ' + data);
        log.info('recv raw data: ' + data);
        //收到数据并组包
        msgBuffer.putData(data);
    });

    socket.on('close', () => {
        //console.log(`${socket.remoteAddress} client disconnected.`);
        log.info(`${socket.remoteAddress} client disconnected.`);
    });

    socket.on('error', error => {
        //console.log(`error:${socket.remoteAddress}异常断开: ${error}`)
        log.info(`error:${socket.remoteAddress}异常断开: ${error}`);
    });

    socket.on('end', () => {
        //console.log(`${socket.remoteAddress} end.`)
        log.info(`${socket.remoteAddress} end.`);
    });

    //收到分包数据的处理（）
    msgBuffer.onMsgRecv(function(data){
        //加密
        let cipher = anPrivateEncrypt(data);

        //返写加密数据
        socket.write(cipher);
        //console.log(`socket.write anPrivateEncrypt : ${cipher.toString('base64')}`);
        log.info(`socket.write anPrivateEncrypt : ${cipher.toString('base64')}`);

        //结束
        socket.end();
    });
});

tcp_server.on('error', err => {
    //console.log(err);
    log.error(err);
});

tcp_server.listen(listen_port, () => {
    //console.log(`tcp_server listening on ${listen_port}...`);
    log.info(`tcp_server listening on ${listen_port}...`);
});
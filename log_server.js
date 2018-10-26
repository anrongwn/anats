'use strict';

const net = require('net');
const log4js = require('log4js');

/**
 * 启动日志服务
 */
log4js.configure({
    appenders: {
        datefile: {
            type: 'datefile',
            filename: './logs/anats_s',
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: 'true',
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%5.5p]   %m'
            }
        },
        server: {
            type: 'tcp-server',
            host: '0.0.0.0',
            port: '9594'
        }
    },
    categories: {
        default: {
            appenders: ['datefile'],
            level: 'ALL'
        }
    }
});

process.on('SIGINT', () => {
    console.log(`logServer Received SIGINT.  process:${process.pid} exit(1).`);

    log4js.shutdown();
    process.exit(1);
});


let server = net.createServer((socket)=>{

});
let log = log4js.getLogger('logServer');
log.info(`log server[${process.pid}] is starting...`);
server.listen(0);
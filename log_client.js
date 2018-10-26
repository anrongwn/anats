'use strict';

const log4js = require('log4js');
const child_process = require('child_process');

/**
 * 启动日志客户端
 */
log4js.configure({
    appenders: {
        network: {
            type: 'tcp',
            host: '127.0.0.1',
            port: '9594'
        }
    },
    categories: {
        default: {
            appenders: ['network'],
            level: 'ALL'
        }
    }
});

let log = log4js.getLogger('logClient');
/**
 * 启动日志服务
 */
function connectLogServer(){
    let log_server = child_process.fork('./log_server.js');
    log_server.on('error', (err)=>{
        console.log(`log server child_process start err : ${err}`);
    });
};

/**
 * 
 * @param {日志内容} data 
 */
function log_info(data){
    
    log.info(`[${process.pid}]${data}`);
    return 0;
}

/**
 * 
 */
module.exports={
    connectLogServer,
    log_info
};
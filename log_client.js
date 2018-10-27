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
function connectLogServer() {
    let log_server = child_process.fork('./log_server.js');
    log_server.on('error', (err) => {
        console.log(`log server child_process start err : ${err}`);
    });
};

/**
 * 
 * @param {日志内容} data 
 */
function log_info(data) {
    writeLog('INFO', data);
    //log.info(`[${process.pid}]${data}`);
}

function log_debug(data) {
    writeLog('DEBUG', data);
    //log.debug(`[${process.pid}]${data}`);
}

function log_trace(data) {
    writeLog('TRACE', data);
}

function log_warn(data){
    writeLog('WARN', data);
}

function log_error(data){
    writeLog('ERROR', data);
}

function log_fatal(data){
    writeLog('FATAL', data);
}

function writeLog(level, data) {
    let contxt = `[${process.pid}]${data}`;
    switch (level) {
        case 'INFO':
            log.info(contxt);
            break;
        case 'DEBUG':
            log.debug(contxt);
            break;
        case 'TRACE':
            log.trace(contxt)
            break;
        case 'WARN':
            log.warn(contxt);
            break;
        case 'ERROR':
            log.error(contxt);
            break;
        case 'ERROR':
            log.error(contxt);
            break;
        case 'FATAL':
            log.fatal(contxt);
            break;
        default:
            log.trace(contxt);
            break;
    }
}
/**
 * 
 */
module.exports = {
    connectLogServer,
    log_info,
    log_debug,
    log_trace,
    log_warn,
    log_error,
    log_fatal
};
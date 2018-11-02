'use strict';

const net = require('net')
const stick = require('../lib/core');
const msgCenter = require('../lib/msgCenter');
//const msgCenter = new stick.msgCenter();
const msgBuffer = new msgCenter();

const timer = require('timers');
let send_count = 0;

process.on('SIGINT', () => {
    console.log('Received SIGINT.  client3 exit(1).');
    process.exit(1);
});


function connectServer() {
    return new Promise((resolve, reject)=>{
        let client = net.createConnection({port:9595, host:'127.0.0.1'}, ()=>{
            client.setNoDelay(true);
            resolve(client);
        });
    });
};


function sendData(data){
    connectServer().then((value)=>{
        const msg = msgBuffer.publish(data)
        let rev = value.write(msg);
        
        return value;
    }).then((value)=>{
        if (value!==undefined){
            value.on('data', (data)=>{
                console.log(`recv echo: ${data.toString('base64')}`);
                //Promise.resolve(value);
            });

            value.on('error', err=>{
                console.log(err);
                //Promise.reject(err);
            })

            value.on('end', ()=>{
                console.log('disconnect from server');
            })
        }
        return value;
        //Promise.resolve(value);
    }).then((value)=>{
        //console.log(value);
        value.end();
    }, (err)=>{
        console.log(err);
    });
};

timer.setInterval(() => {
    send_count++;

    let data = Date.now().toString();
    data += 'username=123&password=1234567,qwe ';
    data += send_count;

    sendData(data);
}, 1000);

/*
let fun = function(){
    return new Promise((resole, reject)=>{
        resole('返回值');
    });
};

let cb = function(){
    return '新值';
};

fun().then((value)=>{
    //console.warn(value);
    return cb();
}).then((resp)=>{
    console.warn(resp);
    console.warn('1 =========<');
});

fun().then((value)=>{
    //console.warn(value);
    cb();
}).then((resp)=>{
    console.warn(resp);
    console.warn('2 =========<');
});

fun().then(cb()).then(resp => {
    console.warn(resp);
    console.warn('3 =========<');
});

fun().then(cb).then(resp => {
    console.warn(resp);
    console.warn('4 =========<');
});
*/
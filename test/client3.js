'use strict';

const net = require('net')
const stick = require('../lib/core');
const msgCenter = require('../lib/msgCenter');
//const msgCenter = new stick.msgCenter();
const msgBuffer = new msgCenter();

const timer = require('timers');
let send_count = 0;

function connectServer() {
    return new Promise((resolve, reject)=>{
        let client = net.createConnection({port:9595, host:'127.0.0.1'}, ()=>{
            client.setNoDelay(true);
            resolve(client);
        });
    });
};


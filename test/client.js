'use strict'

const net = require('net')
const stick = require('../lib/core');
const msgCenter = require('../lib/msgCenter');
//const msgCenter = new stick.msgCenter();
const msgBuffer = new msgCenter();

const timer = require('timers')
let send_count = 0;

process.on('SIGINT', () => {
    console.log('Received SIGINT.  application exit(1).');
    process.exit(1);
});

timer.setInterval(() => {

    let client = net.createConnection({
        port: 9595,
        host: '127.0.0.1'
    }, function () {
        client.setNoDelay(true);
        send_count++;
        //for(let i = 0; i<1000;++i){
        let date = Date.now().toString();
        date += 'username=123&password=1234567,qwe ';
        date += send_count;
        const msg = msgBuffer.publish(date)

        let b = client.write(msg);
        if (b === true) {
            console.log('write data finish!');
        }
    });

    client.on('data', function (data) {
        console.log(`recv echo: ${data.toString('base64')}`);
        //断开
        client.end();
    })

    client.on('end', function () {
        console.log('disconnect from server')
    });

    client.on('error', err => {
        //console.log(client.localAddress+' : '+client.localPort);
        console.log(err);
        process.exit(1);
    });

}, 1000);
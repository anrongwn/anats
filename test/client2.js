'use strict';

const net = require('net')
const stick = require('../lib/core');
const msgCenter = require('../lib/msgCenter');
//const msgCenter = new stick.msgCenter();
const msgBuffer = new msgCenter();

const timer = require('timers');
let send_count = 0;

const sendData = function (data) {
    return new Promise((resolve, reject) => {
        let client = net.createConnection({
            port: 9595,
            host: '127.0.0.1'
        }, function () {
            client.setNoDelay(true);
            const msg = msgBuffer.publish(data)

            let b = client.write(msg);
            if (b === true) {
                //console.log('write data finish!');
            }
        });

        client.on('data', function (data) {
            //console.log(`recv echo: ${data.toString('base64')}`);
            //断开
            client.end();

            resolve(data);
        })

        client.on('end', function () {
            console.log('disconnect from server')
        });

        client.on('error', err => {
            //console.log(client.localAddress+' : '+client.localPort);
            //console.log(err);
            //process.exit(1);
            reject(err);
        });
    });
};

async function sender(data) {
    try {
        let result = await sendData(data);
        console.log(`recv echo: ${result.toString('base64')}`);
    } catch (err) {
        console.log(err);
    };
};

timer.setInterval(() => {
    send_count++;

    let data = Date.now().toString();
    data += 'username=123&password=1234567,qwe ';
    data += send_count;

    sender(data);
}, 1000);

process.on('SIGINT', () => {
    console.log('Received SIGINT.  client2 exit(1).');
    process.exit(1);
});

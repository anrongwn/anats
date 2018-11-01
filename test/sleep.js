'use strict';

const timeout = function(delay){
    return new Promise( (resolve, reject)=>{
        setTimeout(() => {
            console.log('===call timeout cb.');
            resolve('sleepEnd');
        }, delay);
    });
};
async function sleep(ms){
    console.log('sleep started...');

    //let v = await Promise.resolve(timeout(1000));
    let v = await timeout(ms);
    console.log(`sleep result=${v}`);
    /*
    await Promise.resolve(timeout(1000)).then((value)=>{
        console.log(`timer result=${value}`);
    });
    */
   /*
    timeout(1000).then((value)=>{
        console.log(`timer result=${value}`);
    });
    */

    console.log('sleep finished.');
};
sleep(1000);
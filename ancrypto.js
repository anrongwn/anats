const crypto = require('crypto');
const fs = require('fs');

function getPrivateKey() {
    let pem = fs.readFileSync('./pem/an_pr_key.pem');
    return pem.toString();
};

function getPublicKey() {
    let pem = fs.readFileSync('./pem/an_pu_key.pem');
    return pem.toString();
};

function anSign(data) {
    let sign = crypto.createSign('RSA-SHA256');
    if (data === null) return '';

    sign.update(data);

    let key = getPrivateKey();
    return sign.sign(key, 'base64');
};

function anVerify(data, sig) {
    let verify = crypto.createVerify('RSA-SHA256');
    if ((data === null) || (sig === null)) return false;

    verify.update(data);
    let key = getPublicKey();
    return verify.verify(key, sig, 'base64');
}

function anPrivateEncrypt(plain) {
    let key = getPrivateKey();

    if (false === Buffer.isBuffer(plain)) {
        return crypto.privateEncrypt(key, Buffer.from(plain));
    } else {
        return crypto.privateEncrypt(key, plain);
    }
}

function anPublicDecrypt(cipher) {
    let key = getPublicKey();

    if (false === Buffer.isBuffer(cipher)) {
        return crypto.publicDecrypt(key, Buffer.from(cipher));
    } else {
        return crypto.publicDecrypt(key, cipher);
    }
}

function anPublicEncrypt(plain) {
    let key = getPublicKey();
    
    if (false === Buffer.isBuffer(plain)) {
        return crypto.publicEncrypt(key, Buffer.from(plain));
    } else {
        return crypto.publicEncrypt(key, plain);
    }
}
/**
 * 
 * @param {*} cipher -- 经公钥加密的Buffer
 * @return {*} Buffer -- 经私钥解密的Buffer
 * 
 */
function anPrivateDecrypt(cipher) {
    let key = getPrivateKey();

    if (false === Buffer.isBuffer(cipher)) {
        return crypto.privateDecrypt(key, Buffer.from(cipher));
    } else {
        return crypto.privateDecrypt(key, cipher);
    }
}

module.exports = {
    anSign,
    anVerify,
    anPrivateEncrypt,
    anPublicDecrypt,
    anPublicEncrypt,
    anPrivateDecrypt
};
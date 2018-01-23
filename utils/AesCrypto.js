/**
 * @Author: zfowed
 * @Date: 2017-12-23 17:06:07
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-26 00:37:13
 */



'use strict';

const crypto = require('crypto');

class Aes {

    constructor(key) {
        this.key = key;
    }

    encrypt(buf) {
        return Aes.encrypt(this.key, buf);
    }

    decrypt(encrypted) {
        return Aes.decrypt(this.key, encrypted);
    }

    static encrypt(key, buf) {
        var encrypted = "";
        var cip = crypto.createCipher('aes-128-cbc', key);
        encrypted += cip.update(buf, 'utf8', 'hex');
        encrypted += cip.final('hex');

        return encrypted;
    }

    static decrypt(key, encrypted) {
        var decrypted = "";
        var decipher = crypto.createDecipher('aes-128-cbc', key);
        decrypted += decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted
    }

}

module.exports = Aes;
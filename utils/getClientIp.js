/**
 * @Author: zfowed
 * @Date: 2017-12-21 21:39:52
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-25 23:50:39
 */



'use strict';

const utils = require('./index');



module.exports = function (req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

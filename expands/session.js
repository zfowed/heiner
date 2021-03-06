/**
 * @Author: zfowed
 * @Date: 2017-12-23 13:26:04
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-01-01 17:38:05
 */



'use strict';

const koaSession = require('koa-session');

const utils = require('../utils');

module.exports.install = async function (app, _options) {

    /** 初始化配置对象 */
    const options = utils.lodash.isPlainObject(_options) ? _options : {};

    const aes = new utils.AesCrypto(`session-${app.keys}`);

    app.use(koaSession(Object.assign({
        key: 'heiner:sass',
        maxAge: 86400000,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false,
    }, options, {
        encode(body) {
            body = JSON.stringify(body);
            return aes.encrypt(body);
        },
        decode(string) {
            const body = aes.decrypt(string);
            const json = JSON.parse(body);
            return json;
        }
    }), app));

}
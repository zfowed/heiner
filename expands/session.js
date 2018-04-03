/**
 * @Author: zfowed
 * @Date: 2017-12-23 13:26:04
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-01-01 17:38:05
 */



'use strict';

const koaSession = require('koa-session');

const utils = require('../utils');

module.exports.install = async function (app, options) {

    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    const aes = new utils.AesCrypto(`session-${app.keys}`);

    app.use(koaSession(Object.assign({}, options, {
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
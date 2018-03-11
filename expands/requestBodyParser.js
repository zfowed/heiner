/**
 * @Author: zfowed
 * @Date: 2017-12-23 13:26:04
 * @Last Modified by: acer
 * @Last Modified time: 2017-12-26 10:12:00
 */



'use strict';

var koaBodyParser = require('koa-bodyparser');

const utils = require('../utils');

module.exports.install = async function (app, options) {

    if (!utils.lodash.isUndefined(options)) {
        return null;
    }
    
    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    app.use(koaBodyParser(options));
}
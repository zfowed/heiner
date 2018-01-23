/**
 * @Author: zfowed
 * @Date: 2017-12-23 13:26:04
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-23 18:30:16
 */



'use strict';

const koaQs = require('koa-qs');

const utils = require('../utils');

module.exports.install = async function (app, options) {

    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    /** 检查 qs 模式 */
    if (!options.mode || !utils.lodash.isString(options.mode)) {
        throw new Error('${options.mode} 必须是一个不为空的字符串');
    }


    return koaQs(app, options.mode);
}
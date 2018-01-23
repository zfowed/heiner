/**
 * @Author: zfowed
 * @Date: 2017-12-19 23:39:24
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-22 22:42:06
 */



'use strict';

const utils = require('./index');


/**
 * 引入文件模块
 * 
 * @export
 * @param {string}    filePath      文件路径
 * @param {any}       Callback      回调值
 * @returns {any} 
 */
module.exports = async function (filePath, callback) {

    if (!utils.lodash.isFunction(callback)) {
        const def = callback;
        callback = (err, res) => err ? def : res;
    }
    
    const file = new utils.FileLink(filePath);

    try {
        const module = file.module;
        return await utils.performFunction.call(file, callback, null, module);
    } catch (error) {
        return await utils.performFunction.call(file, callback, error);
    }

};
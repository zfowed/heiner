/**
 * @Author: zfowed
 * @Date: 2017-12-19 23:40:45
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-21 20:55:22
 */



'use strict';

const utils = require('./index');


/**
 * 检查文件是否存在
 * 
 * @export
 * @param {string} filePath   文件路径
 * @returns {boolean} 
 */
module.exports = function (filePath) {

    if (!filePath || !utils.lodash.isString(filePath)) {
        return false;
    }

    const file = new utils.FileLink(filePath);

    return file.isFile;
};
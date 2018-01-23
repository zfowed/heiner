/**
 * @Author: zfowed
 * @Date: 2017-12-18 00:37:33
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-21 20:55:19
 */



'use strict';

const utils = require('./index');


/**
 * 检查文件夹是否存在
 * 
 * @export
 * @param {string} dirPath   文件夹路径
 * @returns {boolean} 
 */
module.exports = function (dirPath) {

    if (!dirPath || !utils.lodash.isString(dirPath)) {
        return false;
    }

    const dir = new utils.FileLink(dirPath);
    
    return dir.isDirectory;
};
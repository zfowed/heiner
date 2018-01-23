/**
 * @Author: zfowed
 * @Date: 2017-12-20 21:21:12
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-24 02:05:56
 */



'use strict';

const utils = require('./index');

/**
 * 合并root路径
 * 
 * @export
 * @param {string} filePathJoin   文件路径
 * @returns {string}
 */
const rootJoin = function (...filePathJoin) {

    const isPath = !filePathJoin.some(filePath => !filePath && !utils.lodash.isString(filePath));

    /** 检查路径 */
    if (!isPath) {
        throw new Error(`路径必须是一个不为空的字符串`);
    }

    const rootPath = utils.FileLink.rootPath;
    const filePath = utils.path.join(...filePathJoin);

    if (rootPath && utils.lodash.startsWith(filePath, rootPath)) {
        return filePath;
    }

    return utils.path.join(rootPath, filePath);
};


module.exports = rootJoin;
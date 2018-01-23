/**
 * @Author: zfowed
 * @Date: 2017-12-20 21:45:44
 * @Last Modified by: acer
 * @Last Modified time: 2017-12-26 09:51:12
 */



'use strict';

const utils = require('./index');

/**
 * 递归引入文件夹模块
 * 
 * @param {any} dirPath       文件夹路径
 * @param {any} callback      回调值
 * @returns {any}
 */
const requireDirModule = async function (dirPath, callback) {

    if (!utils.lodash.isFunction(callback)) {
        const def = callback;
        callback = (err, res) => err ? def : res;
    }

    const dir = new utils.FileLink(dirPath);

    try {
        const indexModule = dir.module;
        if (indexModule) return await utils.performFunction.call(dir, callback, null, indexModule);
    } catch (error) {
        
    }


    let moduleContainer = {};
    for (const item of dir.childFile) {
        try {
            const module = item.module;
            const res = await utils.performFunction.call(item, callback, null, module);
            if (!utils.lodash.isUndefined(res)) {
                moduleContainer[item.basename] = res;
            }
        } catch (error) {
            return await utils.performFunction.call(item, callback, error);
        }
    }
    for (const item of dir.childdir) {
        try {
            if (moduleContainer[item.basename]) continue;
            const module = await requireDirModule(item.absolutePath, callback);
            // const res = await utils.performFunction.call(item, callback, null, module);
            if (!utils.lodash.isUndefined(module)) {
                moduleContainer[item.basename] = module;
            }
        } catch (error) {
            return await utils.performFunction.call(item, callback, error);
        }
    }
    return moduleContainer;

};

module.exports = requireDirModule;
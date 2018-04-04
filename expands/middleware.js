/*
 * @Author: zfowed
 * @Date: 2018-04-04 08:58:02
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-04-04 09:04:57
 */



'use strict';

const utils = require('../utils');

module.exports.install = async function (app, options) {

    /** 配置对象不存在表示不启动 */
    if (utils.lodash.isUndefined(options)) {
        return;
    }

    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    /** 检查文件夹 */
    if (!utils.isDirectory(options.dir)) {
        throw new Error(`${options.dir} Middleware文件夹根路径不存在`);
    }

    /** 检查USE */
    if (!utils.lodash.isArray(options.use)) {
        throw new Error('${options.use} 必须是一个数组');
    }

    /** 检查USE */
    if (!utils.lodash.isPlainObject(options.options)) {
        throw new Error('${options.options} 必须是一个普通对象');
    }

    for (const name of options.use) {
        
        if (!utils.lodash.isString(name)) {
            throw new Error('${options.use} 只能存在字符串');
        }

        const fileEl = new utils.FileLink(options.dir, `${name}.js`);
        
        try {
            if (!utils.lodash.isFunction(fileEl.module)) {
                throw new Error(`${fileEl.absolutePath} 模块必须是一个函数`);
            }
            const fn = await utils.performFunction(fileEl.module, options.options[name], app);
            if (utils.lodash.isFunction(fn)) {
                app.use(fn);
            }
        } catch (error) {
            throw error;
        }

    }

};
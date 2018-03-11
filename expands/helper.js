/**
 * @Author: zfowed
 * @Date: 2017-12-20 20:26:50
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-01-04 21:23:17
 */



'use strict';

const utils = require('../utils');

module.exports.install = async function (app, options) {

    if (utils.lodash.isUndefined(options)) {
        return null;
    }

    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    /** 检查文件夹 */
    if (!utils.isDirectory(options.dir)) {
        throw new Error(`${options.dir} Helper文件夹根路径不存在`);
    }

    /** 检查 ${options.key} */
    if (!options.key || !utils.lodash.isString(options.key)) {
        throw new Error('${options.key} 必须是一个不为空的字符串');
    }


    /** 拉取内置模块 */
    let helper = {};
    if (utils.lodash.isPlainObject(options.require)) {
        const requireHelper = utils.lodash.mapValues(options.require, helperName => require(helperName));
        utils.lodash.merge(helper, requireHelper);
    } else if (utils.lodash.isArray(options.require)) {
        const requireHelper = utils.lodash.fromPairs(options.require.map(helperName => [helperName, require(helperName)]));
        utils.lodash.merge(helper, requireHelper);
    }

    /** 拉取自定义Helper */
    const requireHelper = await utils.requireDirModule(options.dir, {});
    utils.lodash.merge(helper, requireHelper);

    /** 挂载 */
    app[options.key] = helper;
    app.context[options.key] = helper;


    return helper;

};
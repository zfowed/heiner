/**
 * @Author: zfowed
 * @Date: 2017-12-24 22:15:41
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-24 22:20:31
 */



'use strict';

const koaViews = require('koa-views');

const utils = require('../../utils');

module.exports = async function (app, router, options) {


    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    /** 检查文件夹 */
    if (!utils.isDirectory(options.root)) {
        throw new Error(`${options.root} Router文件夹根路径不存在`);
    }

    const dir = utils.rootJoin(options.root);

    app.use(koaViews(dir, options));

};

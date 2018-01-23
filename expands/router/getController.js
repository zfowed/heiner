/**
 * @Author: zfowed
 * @Date: 2017-12-24 15:55:06
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-01-04 21:21:12
 */



'use strict';

const utils = require('../../utils');


module.exports = async function (app, router, options) {

    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    /** 检查文件夹 */
    if (!utils.isDirectory(options.dir)) {
        throw new Error(`${options.dir} Controller文件夹根路径不存在`);
    }


    app.Controller = class Controller {
        constructor(self) {
            Object.assign(this, self);
            for (const key of Object.getOwnPropertyNames(new.target.prototype)) {
                if (key !== 'constructor' && typeof this[key] === 'function') {
                    this[key] = this[key].bind(this);
                }
            }
        }
    }

    const self = { app };
    if (utils.lodash.isPlainObject(options.bindSelf)) {
        utils.lodash.assign(self, utils.lodash.mapValues(options.bindSelf, key => {
            return utils.lodash.get(self, key);
        }));
    }

    const controller = await utils.requireDirModule(options.dir, async function (err, controllerInit) {

        if (err) {
            throw err;
        }

    

        if (!utils.lodash.isFunction(controllerInit) || utils.isClass(controllerInit)) {
            throw new Error(`${this.absolutePath} 模块必须是一个函数！`);
        }

        const controller = await utils.performFunction(controllerInit, app);

        if (utils.isClass(controller)) {
            if (Object.getPrototypeOf(controller) !== app.Controller) {
                throw new Error(`${this.absolutePath} 模块返回的类必须继承\${app.Controller}！`);
            }
            return new controller(self);
        } else if (utils.lodash.isFunction(controller)) {
            return item.bind(self);
        }

        throw new Error(`${this.absolutePath} 模块必须返回一个函数或类！`);

    });

    return controller;

};
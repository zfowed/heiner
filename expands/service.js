/**
 * @Author: zfowed
 * @Date: 2017-12-21 23:39:09
 * @Last Modified by: acer
 * @Last Modified time: 2018-01-04 16:07:18
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
        throw new Error(`${options.dir} Service文件夹根路径不存在`);
    }

    /** 检查 ${options.key} */
    if (!options.key || !utils.lodash.isString(options.key)) {
        throw new Error('${options.key} 必须是一个不为空的字符串');
    }

    app.Service = class Service {
        constructor(self) {
            Object.assign(this, self);
            for (const key of Object.getOwnPropertyNames(new.target.prototype)) {
                if (key !== 'constructor' && typeof this[key] === 'function') {
                    this[key] = this[key].bind(this);
                }
            }
        }
    }

    const service = await utils.requireDirModule(options.dir, async function (err, serviceInit) {

        if (err) {
            throw err;
        }

        if (!utils.lodash.isFunction(serviceInit) || utils.isClass(serviceInit)) {
            throw new Error(`${this.absolutePath} 模块必须是一个函数！`);
        }

        const service = await utils.performFunction(serviceInit, app);
        if (utils.isClass(service) && Object.getPrototypeOf(service) !== app.Service) {
            throw new Error(`${this.absolutePath} 模块返回的类必须继承\${app.Service}！`);
        } else if (!utils.lodash.isFunction(service)) {
            throw new Error(`${this.absolutePath} 模块必须返回一个函数或类！`);
        }
        return service;
    });

    const getService = function (target, self) {
        let source = {};
        utils.lodash.forEach(target, (item, key) => {
            Object.defineProperty(source, key, {
                configurable: true,
                enumerable: true,
                get() {
                    if (utils.lodash.isPlainObject(item)) {
                        Object.defineProperty(source, key, {
                            configurable: false,
                            enumerable: true,
                            value: getService(item, self)
                        });
                        return source[key];
                    } else if (utils.isClass(item)) {
                        Object.defineProperty(source, key, {
                            configurable: false,
                            enumerable: true,
                            value: new item(self)
                        });
                        return source[key];
                    } else if (utils.lodash.isFunction(item)) {
                        Object.defineProperty(source, key, {
                            configurable: false,
                            enumerable: true,
                            value: item.bind(self)
                        });
                        return source[key];
                    }
                    return source[key] = undefined;
                }
            });
        });
        return source;
    };


    app.use(function (ctx, next) {
        const self = { app, ctx, next };
        utils.lodash.assign(ctx, {
            [options.key]: getService(service, self)
        });
        if (utils.lodash.isPlainObject(options.bindSelf)) {
            utils.lodash.assign(self, utils.lodash.mapValues(options.bindSelf, key => {
                return utils.lodash.get(self, key);
            }));
        }
        return next();
    });

    return service;

};


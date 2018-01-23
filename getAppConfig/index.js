/**
 * @Author: zfowed
 * @Date: 2017-12-20 14:24:34
 * @Last Modified by: acer
 * @Last Modified time: 2018-01-23 09:27:33
 */



'use strict';

const defaultConfig = require('./config.js');
const utils = require('../utils');

/**
 * 获取app配置信息
 * 
 * @param {any} configDir   存放配置文件的文件夹
 * @param {any} env         拉取配置文件模式
 * @returns {any}
 */
module.exports = async function (configDir, env) {

    
    /** 检测项目目录是否存在 */
    if (!utils.isDirectory(configDir)) {
        throw new Error(`${configDir} 配置文件夹根路径不存在`);
    }

    let envList = env.split(',');
    envList.unshift('default');
    let config = defaultConfig;
    
    for (const envItem of envList) {

        const jsonConfigPath = utils.path.join(configDir, `${envItem}.json`);
        const jsonConfig = await utils.requireModule(jsonConfigPath, function (err, module) {
            if (err) {
                if (!this.isFile) return {};
                throw new Error(`${this.absolutePath} 配置文件出错`);
            } else if (!utils.lodash.isPlainObject(module)) {
                throw new Error(`${this.absolutePath} 配置模块必须输出一个普通对象`);
            }
            return module;
        });

        const jsConfigPath = utils.path.join(configDir, `${envItem}.js`);
        const jsConfig = await utils.requireModule(jsConfigPath, function (err, module) {
            if (err) {
                if (!this.isFile) return {};
                throw new Error(`${this.absolutePath} 配置文件出错`);
            } else if (!utils.lodash.isPlainObject(module)) {
                throw new Error(`${this.absolutePath} 配置模块必须输出一个普通对象`);
            }
            return module;
        });


        utils.lodash.merge(config, jsonConfig, jsConfig);
    }

    config.keys = config.keys || [utils.uuidv1()];

    return config;


};
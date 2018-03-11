/**
 * @Author: zfowed
 * @Date: 2017-12-20 22:40:37
 * @Last Modified by: acer
 * @Last Modified time: 2018-01-10 09:40:03
 */



'use strict';

const utils = require('../utils');

const Sequelize = require('sequelize');

module.exports.install = async function (app, options) {

    if (utils.lodash.isUndefined(options)) {
        return null;
    }

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
        throw new Error(`${options.dir} Sequelize文件夹根路径不存在`);
    }

    /** 检查 ${options.key} */
    if (!options.key || !utils.lodash.isString(options.key)) {
        throw new Error('${options.key} 必须是一个不为空的字符串');
    }

    /** 检查数据库配置默认值 */
    if (!utils.lodash.isPlainObject(options.defaultOptions)) {
        throw new Error('${options.defaultOptions} 必须是一个普通对象');
    }

    /** 检查数据库配置 */
    if (!utils.lodash.isPlainObject(options.database)) {
        throw new Error('${options.database} 必须是一个普通对象');
    }

    let exContainer = {};

    for (const [name, option] of Object.entries(options.database)) {

        if (!utils.lodash.isPlainObject(option)) {
            throw new Error(`\${options.database["${name}"]} 必须是一个普通对象`)
        }

        let mergeOption = utils.lodash.merge({}, options.defaultOptions, option);

        /** 检查数据库配置 operatorsAliases */
        if (!mergeOption.operatorsAliases || !utils.lodash.isString(mergeOption.operatorsAliases)) {
            throw new Error('${options.operatorsAliases} 必须是一个不为空的字符串');
        }
        

        mergeOption.operatorsAliases = utils.lodash.mapKeys(Sequelize.Op, (value, key) => utils.lodash.template(mergeOption.operatorsAliases)({ key }));
        
        if (mergeOption.storage) {
            mergeOption.storage = utils.rootJoin(mergeOption.storage);
        }

        const sequelize = new Sequelize(utils.lodash.omit(mergeOption, ['modelNameMode', 'modelKeyMode']));

        const models = {};
        const ex = {
            $Sequelize: Sequelize,
            $sequelize: sequelize,
            models
        };
        exContainer[name] = ex;

        const modelsdirPath = utils.path.join(options.dir, name, 'models');
        const modelsdir = utils.FileLink.of(modelsdirPath);
        if (modelsdir.isDirectory) {
            for (const childFileItem of modelsdir.childFile) {
                let modelName = childFileItem.basename;
                ex.models[modelName] = sequelize.import(modelName, childFileItem.module);
            }
        }


        const indexFilePath = utils.path.join(options.dir, name, 'index.js');
        const indexFile = utils.FileLink.of(indexFilePath);
        const indexModule = await utils.requireModule(indexFile.path, null);
        if (indexModule) {
            await utils.performFunction(indexModule, ex);
        }

    }

    /** 挂载 */
    app[options.key] = exContainer;
    app.context[options.key] = exContainer;
    
    return exContainer;
};
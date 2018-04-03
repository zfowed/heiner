/**
 * @Author: zfowed
 * @Date: 2017-12-18 00:36:32
 * @Last Modified by: acer
 * @Last Modified time: 2018-01-02 16:52:20
 */



'use strict';

const utils = require('../utils');

/**
 * 获取app启动信息
 * 
 * @export
 * @param {string} projectDir      项目根路径
 * @param {object} projectOption   项目启动选项
 * @returns {object} app启动信息
 */
module.exports = async function (projectDir, projectOption) {

    /** 检测项目目录是否存在 */
    if (!utils.isDirectory(projectDir)) {
        throw new Error(`${projectDir} 项目根路径不存在`);
    }

    utils.FileLink.rootPath = projectDir;

    /** 检测是项目启动选项否一个普通对象 */
    if (!utils.lodash.isPlainObject(projectOption)) {
        throw new Error('${projectOption} 项目启动选项选项必须是一个对象');
    }

    /** @type {object | null} package.json */
    const pkg = await utils.requireModule(utils.path.join(projectDir, 'package.json'), null);

    /** @type {string} 项目名称 */
    const name = String((pkg ? pkg.name : null) || utils.path.basename(projectDir));

    /** @type {object} 命令行参数 */
    const argv = utils.yargs.argv;

    /** @type {string} 启动项目模式（用于拉取配置文件） */
    const env = String(projectOption.env || argv.NODE_ENV || process.env.NODE_ENV || 'development');

    /** @type {string} 项目根目录 */
    const root = projectDir;

    /** @type {object} 启动项目时选项 */
    const option = projectOption;


    return { name, env, argv, pkg, root, option };
};
/**
 * @Author: zfowed
 * @Date: 2017-12-23 13:04:46
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-01-21 22:08:18
 */



'use strict';

const Router = require('koa-router');

const utils = require('../../utils');

const useView = require('./useView');
const getController = require('./getController');



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
        throw new Error(`${options.dir} Router文件夹根路径不存在`);
    }

    const router = new Router();

    await useView(app, router, options.view);

    const controller = await getController(app, router, options.controller)

    const itemRouterFileList = new utils.FileLink(options.dir).childFile;
    for (const itemRouterFile of itemRouterFileList) {
        if (itemRouterFile.name !== 'index.js' && utils.lodash.isFunction(itemRouterFile.module)) {
            const itemRouter = new Router();
            const itemController = controller[itemRouterFile.basename];
            await utils.performFunction(itemRouterFile.module, itemRouter, itemController);
            router.use(`/${itemRouterFile.basename}`, itemRouter.routes(), itemRouter.allowedMethods());
        }
    }
    
    const indexRouterFile = new utils.FileLink(options.dir, 'index.js');
    if (indexRouterFile.isFile && utils.lodash.isFunction(indexRouterFile.module)) {
        await utils.performFunction(indexRouterFile.module, router, controller);
    }


    app.router = router;
    app.use(router.routes(), router.allowedMethods());
};
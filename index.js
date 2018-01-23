/**
 * @Author: zfowed
 * @Date: 2017-12-17 00:37:15
 * @Last Modified by: acer
 * @Last Modified time: 2018-01-10 10:42:01
 */



'use strict';

const Koa = require('koa');

const utils = require('./utils');

const getAppInfo = require('./getAppInfo');
const getAppConfig = require('./getAppConfig');

const heinerSession = require('./expands/session');
const heinerRequestClient = require('./expands/requestClient');
const heinerLogger = require('./expands/logger');

const heinerRequestQuery = require('./expands/requestQuery');
const heinerRequestBodyParser = require('./expands/requestBodyParser');
const heinerRequestFormidable = require('./expands/requestFormidable');
const heinerHelper = require('./expands/helper');
const heinerHttp = require('./expands/http');
const heinerSequelize = require('./expands/sequelize');
const heinerService = require('./expands/service');
const heinerRouter = require('./expands/router');
const heinerStaticServer = require('./expands/staticServer');



const heiner = async function (projectDir, projectOption) {

    const app = new Koa();


    const appInfo = await getAppInfo(projectDir, projectOption);

    app.info = appInfo;

    const appConfig = await getAppConfig(projectOption.configDir, appInfo.env);

    app.config = appConfig;
    app.keys = app.config.keys;

    const useEvent = utils.lodash.isFunction(projectOption.useEvent) ? projectOption.useEvent : _ => null;

    const heinerUse = async function (name, ex) {
        const result = await utils.performFunction(ex.install, app, appConfig[name]);
        return useEvent(name, result);
    };

    await heinerUse('session', heinerSession);

    await heinerUse('requestClient', heinerRequestClient);

    await heinerUse('logger', heinerLogger);

    await heinerUse('helper', heinerHelper);
    
    await heinerUse('http', heinerHttp);

    await heinerUse('sequelize', heinerSequelize);

    await heinerUse('service', heinerService);
    
    await heinerUse('requestQuery', heinerRequestQuery);
    
    await heinerUse('requestBodyParser', heinerRequestBodyParser);

    await heinerUse('requestFormidable', heinerRequestFormidable);
    
    await heinerUse('router', heinerRouter);

    await heinerUse('staticServer', heinerStaticServer);

    
    
    /** 检查端口 */
    if (!utils.lodash.isInteger(appConfig.port)) {
        throw new Error(`${appConfig.port} 端口必须是一个大于零的整数`);
    } else if (appConfig.port < 0) {
        throw new Error(`${appConfig.port} 端口必须是一个大于零的整数`);
    }


    app.on('error', err => {
        console.error(err);
    });

    app.listen(appConfig.port);
    return app;
};

module.exports = heiner;
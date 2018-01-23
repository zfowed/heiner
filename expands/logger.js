/**
 * @Author: zfowed
 * @Date: 2018-01-01 20:33:51
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-01-21 21:47:55
 */



'use strict';

const log4js = require('log4js');
const utils = require('../utils');

module.exports.install = async function (app, options) {


    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    /** 检查文件夹 */
    if (!utils.isDirectory(options.dir)) {
        throw new Error(`${options.dir} Logger文件夹根路径不存在`);
    }

    /** 模式 */
    if (!['console', 'dateFile'].includes(options.type)) {
        throw new Error('${options.type} Logger模式必须是["console", "dateFile"]');
    }


    log4js.configure({
        replaceConsole: true,
        appenders: {
            'console': {
                "type": "console",
                layout: {
                    type: 'pattern',
                    pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c -%] %x{pid} %m',
                },
            },
            'request': {
                type: options.type,
                filename: utils.rootJoin(options.dir, './request/'),
                alwaysIncludePattern: true,
                compress: false,
                pattern: 'yyyy-MM-dd/hh_mm.log',
                encoding: 'utf-8',
            },
        },
        categories: {
            'default': {
                appenders: ['console'],
                level: 'trace'
            },
            'request': {
                appenders: ['request'],
                level: 'trace'
            },
        }
    });

    
    const log = log4js.getLogger('request');

    app.use(async function (ctx, next) {
        const requestTime = utils.moment();

        let logList = [];

        ctx.log = function (info) {
            logList.push('        [' + utils.moment().format('YYYY-MM-DDTHH:mm:ss.SSS') +  `] ${info}`);
        };


        let error = null;

        try {
            await next();
        } catch (err) {
            ctx.status = 500;
            error = err;
        }

        const ua = ctx.client.get('ua');

        let logInfo = [
            `[${ctx.client.get('mark') || ctx.client.get('id')}]`,
            `[${ctx.client.get('ip')}]`,
            `[${requestTime.format('YYYY-MM-DDTHH:mm:ss.SSS')}]`,
            ctx.method,
            ctx.url,
            ctx.status,
            `${utils.moment().valueOf() - requestTime.valueOf()}ms`
        ];



        if (ua) {
            logInfo.push(`\n    UA: ${ctx.client.get('ua')}`);
        }


        if (ctx.method === 'POST') {
            const bodystr = JSON.stringify(ctx.request.body);
            if (bodystr !== '{}') logInfo.push(`\n    BODY: ${bodystr}`);
        }

        if (logList.length) {
            logInfo.push(`\n    LOGS: \n${logList.join('\n')}`);
        }

        if (error) {
            const errstr = `${error.stack}`.replace(/\n/g, '\n    ');
            logInfo.push(`\n    ERROR: ${errstr}`);
            log.error(logInfo.join(' '));
        } else {
            log.info(logInfo.join(' '));
        }
        
    });


};
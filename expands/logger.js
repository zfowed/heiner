/**
 * @Author: zfowed
 * @Date: 2018-01-01 20:33:51
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-02-28 14:43:00
 */



'use strict';

const log4js = require('log4js');
const utils = require('../utils');

module.exports.install = async function (app, options) {

    if (!utils.lodash.isUndefined(options)) {
        return null;
    }

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

    if (!utils.lodash.isString(options.template)) {
        throw new Error('${options.template} Logger模板必须是字符串');
    }

    log4js.configure({
        replaceConsole: true,
        appenders: {
            'console': {
                "type": "console",
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

    const toString = function (content) {
        if (utils.lodash.isPlainObject(content)) {
            try {
                content = JSON.stringify(content, null, '    ');
            } catch (error) {
                
            }
        }
        return `${content}`.replace(/\n/g, '\n        ');
    };

    let concurrency = 0;

    app.use(async function (ctx, next) {

        concurrency += 1;

        // 请求时间
        const requestTime = utils.moment();

        let requestLog = '';

        let currentLevelIndex = 2;
        const levelList = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

        const recordingLog = function (level, content) {
            const levelIndexOf = levelList.indexOf(level);
            if (levelIndexOf > currentLevelIndex) {
                currentLevelIndex = levelIndexOf;
            }
            const time = utils.moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
            requestLog += `\n    [${time}] [${level}] - ${toString(content)}`;
        };

        ctx.log = utils.lodash.bind(recordingLog, recordingLog, 'info');
        ctx.log.trace = utils.lodash.bind(recordingLog, recordingLog, 'trace');
        ctx.log.debug = utils.lodash.bind(recordingLog, recordingLog, 'debug');
        ctx.log.info = ctx.log;
        ctx.log.warn = utils.lodash.bind(recordingLog, recordingLog, 'warn');
        ctx.log.error = utils.lodash.bind(recordingLog, recordingLog, 'error');
        ctx.log.fatal = utils.lodash.bind(recordingLog, recordingLog, 'fatal');


        try {
            await next();
        } catch (error) {
            ctx.status = 500;
            ctx.log.fatal(`${error.stack}`);
        }

        let logInfo = utils.lodash.template(options.template)({
            remote_addr: ctx.client.ip,
            remote_user: ctx.client.uid,
            time_local: requestTime.format('YYYY-MM-DDTHH:mm:ss.SSS'),
            request: `${ctx.method} ${ctx.href} HTTP/${ctx.req.httpVersion}`,
            http_host: ctx.get('host'),
            status: ctx.status,
            // upstream_status: 
            body_bytes_sent: ctx.response.length || 0,
            http_referer: ctx.get('referer') || '-',
            http_user_agent: ctx.client.ua,
            // ssl_protocol: 
            // ssl_cipher: 
            // upstream_addr: 
            request_time: utils.moment().valueOf() - requestTime.valueOf(),
            // upstream_response_time: 
            logs: requestLog,
            concurrency: concurrency,
            _ctx: ctx
        });

        concurrency -= 1;
        
        log[levelList[currentLevelIndex]](logInfo);

    });


};
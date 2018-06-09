/**
 * @Author: zfowed
 * @Date: 2017-12-24 22:27:46
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-24 23:01:33
 */



'use strict';

const fs = require('fs');
const path = require('path');

const koaStatic = require('koa-static');

const utils = require('../../utils');


const readRangeHeader = function (range, totalLength) {

    if (range == null || range.length == 0)
        return null;

    var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    var start = parseInt(array[1]);
    var end = parseInt(array[2]);

    if (isNaN(start)) {
        start = 0;
    }
    if (isNaN(end)) {
        end = totalLength - 1;
    }

    return [start, end];
};



module.exports.install = function (app, options) {

    if (utils.lodash.isUndefined(options)) {
        return null;
    }
    
    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    
    const rootDirList = utils.lodash.castArray(utils.rootJoin(options.dir));


    const useService = function (staticService) {


        app.use(async (ctx, next) => {

            let exist = true;
    
            await staticService(ctx, async _ => {
                exist = false;
            });
    
            if (!exist) { return next(); }
    
            const rangeHeader = ctx.get('range');
            if (!rangeHeader) { return ; }
    
            const fileEl = new utils.FileLink(filename);
    
            const [start, end] = readRangeHeader(rangeHeader, fileEl.size);
    
            if (start >= fileEl.size || end >= fileEl.size) {
                ctx.set('Content-Range', 'bytes */');
                ctx.status = 416;
                return;
            }
    
            ctx.set('Content-Range', `bytes ${start}-${end}/${fileEl.size}`);
            ctx.set('Content-Length', start === end ? 0 : (end - start + 1));
            ctx.set('Accept-Ranges', 'bytes');
            ctx.set('Cache-Control', 'no-cache');
    
            ctx.status = 206;
    
            ctx.body = fs.createReadStream(filename, { start, end });
    
        });
    
    };


    for (const rootDir of rootDirList) {
        
        /** 检查文件夹 */
        if (!utils.isDirectory(rootDir)) {
            throw new Error(`${rootDir} StaticServer文件夹根路径不存在`);
        }

        const staticService = koaStatic(rootDir, options);

        useService(staticService);

    }


};
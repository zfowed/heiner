/**
 * @Author: zfowed
 * @Date: 2017-12-23 18:28:00
 * @Last Modified by: acer
 * @Last Modified time: 2018-01-04 10:45:46
 */



'use strict';

const formidable = require('formidable');

const utils = require('../utils');



module.exports.install = async function (app, options) {

    if (utils.lodash.isUndefined(options)) {
        return null;
    }
    
    /** 初始化配置对象 */
    if (utils.lodash.isUndefined(options)) {
        return;
    }

    /** 初始化配置对象 */
    if (!utils.lodash.isPlainObject(options)) {
        throw new Error('${options} 必须是一个普通对象');
    }

    options = utils.lodash.merge({
        dir: null,
        bytesExpected: 10 * 1024 * 1024,
        maxFieldsSize: 2 * 1024 * 1024,
        maxFields: 1000,
        multiples: false,
        hash: false,
        fileNum: 1,
        fileSize: 10 * 1024 * 1024,
        fileType: null,
        fileExt: null,
    }, options);

    const uploadDir = options.dir;

    const checkOption = function (option) {
        if (uploadDir && !utils.isDirectory(uploadDir)) {
            return new Error(`接收上传文件夹目录不存在！`);
        }
        if (!utils.lodash.isNumber(option.bytesExpected)) {
            return new Error(`字节预期必须是一个数字！`);
        }
        if (!utils.lodash.isNumber(option.maxFieldsSize)) {
            return new Error(`最大字段字节大小必须是一个数字！`);
        }
        if (!utils.lodash.isNumber(option.maxFields)) {
            return new Error(`最大字段数必须是一个数字！`);
        }
        if (!utils.lodash.isBoolean(option.multiples)) {
            return new Error('${multiples}字段必须是布尔值！');
        }
        if (!utils.lodash.isBoolean(option.hash) && !utils.lodash.isString(option.hash)) {
            return new Error('${hash}字段必须是字符串或者布尔值！');
        }
        if (!utils.lodash.isNumber(option.fileNum)) {
            return new Error(`最大文件数必须是一个数字！`);
        }
        if (option.fileType !== null) {
            if (utils.lodash.isString(option.fileType)) {
                option.fileType = [option.fileType];
            } if (utils.lodash.isArray(option.fileType) && option.fileType.some(fileType => !utils.lodash.isString(fileType))) {
                return new Error(`验证上传文件类型参数错误！`);
            }
        }
        if (option.fileExt !== null) {
            if (utils.lodash.isString(option.fileExt)) {
                option.fileExt = [option.fileExt];
            } if (utils.lodash.isArray(option.fileExt) && option.fileExt.some(fileExt => !utils.lodash.isString(fileExt))) {
                return new Error(`验证上传文件类型参数错误！`);
            }
        }
        return null;
    };

    const checkOptionThrow = function (option) {
        const error = utils.lodash.isError(checkOption(option));
        if (utils.lodash.isError(error)) {
            throw error;
        }
    };

    checkOptionThrow(options);

    const getFormidable = async function (request, option) {
        return new Promise(async (resolve, reject) => {

            /** 初始化配置对象 */
            if (utils.lodash.isUndefined(option)) {
                option = {};
            }

            /** 初始化配置对象 */
            if (!utils.lodash.isPlainObject(option)) {
                return throwError(new Error('${option} 必须是一个普通对象！'));
            }

            option = utils.lodash.merge(options, option);

            let error = checkOption(options);

            const throwError = function (err) {
                request.pause();
                error = err;
                return reject(err);
            };

            if (utils.lodash.isError(error)) {
                return throwError(error);
            }

            var form = new formidable.IncomingForm();

            if (form.bytesExpected > option.bytesExpected) {
                return throwError(new Error(`字节预期不可以超过${option.bytesExpected}字节！`));
            }

            form.encoding = 'utf-8';
            if (uploadDir) form.uploadDir = utils.rootJoin(uploadDir);
            form.keepExtensions = false;
            form.maxFieldsSize = option.maxFieldsSize;
            form.maxFields = option.maxFields;
            form.multiples = option.multiples;
            form.hash = option.hash;

            let fileNum = 0;

            form.onPart = function (part) {
                if (option.fileNum) {
                    if (part.filename) { fileNum += 1; }
                    if (fileNum > option.fileNum) {
                        return throwError(new Error(`上传文件数量不可以超过${option.fileNum}个！`));
                    }
                }
                if (option.fileExt && !option.fileExt.includes(utils.path.extname(part.filename))) {
                    return throwError(new Error(`上传文件后缀名必须是(${option.fileExt})！`));
                }
                form.handlePart(part);
            };

            form.on('progress', function (bytesReceived, bytesExpected) {
                if (bytesExpected > option.bytesExpected) {
                    return throwError(new Error(`字节预期不可以超过${option.bytesExpected}字节！`));
                }
            });

            // form.on('field', function (name, value) { });

            form.on('fileBegin', function (name, file) {
                if (option.fileType && !option.fileType.includes(file.type)) {
                    return throwError(new Error(`上传文件类型必须是(${option.fileType})！`));
                }
            });

            form.on('file', function (name, file) {
                if (file.size > option.fileSize) {
                    return throwError(new Error(`上传文件大小不可以超过${option.fileSize}字节！`));
                }
            });

            form.on('error', function (err) {
                return throwError(err);
            });

            form.on('aborted', function () {
                return throwError(new Error(`当前请求被用户发出中止时！`));
            });

            // form.on('end', function () { });

            form.parse(request, function (err, fields, files) {
                if (err) return throwError(err);
                if (error) return throwError(error);
                return resolve({ fields, files });
            });

        });


    };

    app.use(async function (ctx, next) {
        ctx.request.getFormidable = utils.lodash.bind(getFormidable, this, ctx.req);
        return next();
    });

    return getFormidable;

};
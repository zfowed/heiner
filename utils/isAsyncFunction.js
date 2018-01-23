/**
 * @Author: zfowed
 * @Date: 2017-12-21 21:39:52
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-21 21:40:13
 */



'use strict';

const utils = require('./index');


const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

module.exports = function (fn) {
    return utils.lodash.isFunction(fn) && Object.getPrototypeOf(fn).constructor === AsyncFunction;
};

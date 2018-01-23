/**
 * @Author: zfowed
 * @Date: 2017-12-23 01:20:08
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-23 01:21:11
 */



'use strict';

const utils = require('./index');

module.exports = function (value) {

    if (!utils.lodash.isFunction(value)) {
        return false;
    }

    const valueString = utils.lodash.trim(value.toString());

    if (!utils.lodash.startsWith(valueString, 'class')) {
        return false;
    }

    return true;
};
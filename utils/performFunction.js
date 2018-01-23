/**
 * @Author: zfowed
 * @Date: 2017-12-21 21:37:55
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-22 21:53:58
 */



'use strict';

const utils = require('./index');


module.exports = async function (fn, ...params) {
    return new Promise(async (resolve, reject) => {
        params = utils.lodash.castArray(params);

        let res;

        try {
            
            if (utils.isAsyncFunction(fn)) {
                res = await fn.apply(this, params);
                return resolve(res);
            } else if (utils.lodash.isFunction(fn)) {
                res = fn.apply(this, params);
                return resolve(res);
            }

            throw new Error('${fn} 不是一个函数');

        } catch (error) {

            return reject(error);

        }

    });
};
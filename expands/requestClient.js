/**
 * @Author: zfowed
 * @Date: 2018-01-01 17:32:37
 * @Last Modified by: acer
 * @Last Modified time: 2018-01-08 09:15:31
 */



'use strict';

const uaParser = require('ua-parser-js');
const requestIp = require('request-ip');
const utils = require('../utils');

class Client {
    constructor(ctx) {
        this.ctx = ctx;

        this.value = {};

        if (!this.ctx.session.$$client) {
            this.ctx.session.$$client = {};
        }

        utils.lodash.assign(this.value, this.ctx.session.$$client, uaParser(this.ctx.get('user-agent')), {
            id: utils.uuidv1().replace(/-/g, ""),
            ip: requestIp.getClientIp(this.ctx.req)
        });
        

    }

    get(key){
        if (utils.lodash.isUndefined(key)) {
            return utils.lodash.cloneDeep(this.value);
        } 
        const value = utils.lodash.get(this.value, `${key}`);
        if (utils.lodash.isPlainObject(value)) {
            return utils.lodash.cloneDeep(value);
        }
        return value;
    }

    set(key, value){
        utils.lodash.set(this.ctx.session.$$client, `${key}`, value);
        utils.lodash.set(this.value, `${key}`, value);
        return value;
    }
    
    unset(key){
        utils.lodash.unset(this.ctx.session.$$client, `${key}`);
        utils.lodash.unset(this.value, `${key}`);
        return undefined;
    }

}

module.exports.install = async function (app, options) {

    app.use(async (ctx, next) => {
        
        ctx.client = new Client(ctx);

        return next();
    });

}
/**
 * @Author: zfowed
 * @Date: 2018-01-01 17:32:37
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-02-21 21:16:42
 */



'use strict';

const uaParser = require('ua-parser-js');
const requestIp = require('request-ip');
const utils = require('../utils');

class Client {
    constructor(ctx) {
        this.ctx = ctx;
        this._uid = this.ctx.session.uid || (this.ctx.session.uid = utils.uuidv1().replace(/-/g, ""));
        this._ip = null;
        this._uaParser = null;
    }

    get uid() {
        return this._uid;
    }

    set uid(uid) {
        this.ctx.session._uid = uid;
        this._uid = uid;
    }

    get ip() {
        return this._ip || (this._ip = requestIp.getClientIp(this.ctx.req));
    }

    get uaParser() {
        return this._uaParser || (this._uaParser = uaParser(this.ctx.get('user-agent')));
    }

    get ua() {
        return this.ctx.get('user-agent');
    }

    get browser() {
        return this.uaParser.browser;
    }

    get engine() {
        return this.uaParser.engine;
    }

    get os() {
        return this.uaParser.os;
    }

    get device() {
        return this.uaParser.device;
    }

    get cpu() {
        return this.uaParser.cpu;
    }

}

module.exports.install = async function (app, options) {

    app.use(async (ctx, next) => {
        
        ctx.client = new Client(ctx);

        return next();
    });

}
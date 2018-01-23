/**
 * @Author: acer
 * @Date: 2018-01-10 10:40:52
 * @Last Modified by: acer
 * @Last Modified time: 2018-01-23 09:12:17
 */



'use strict';

const request = require('request');

module.exports.install = async function (app, options) {



    app.curl = request;
    app.context.curl = request;

    

}
/**
 * @Author: zfowed
 * @Date: 2017-12-18 00:37:27
 * @Last Modified by: zfowed
 * @Last Modified time: 2018-01-01 18:22:10
 */



'use strict';

module.exports.fs = require('fs');
module.exports.path = require('path');


module.exports.yargs = require('yargs');
module.exports.moment = require('moment');
module.exports.lodash = require('lodash');
module.exports.uuidv1 = require('uuid/v1');
module.exports.uuidv4 = require('uuid/v4');
module.exports.uuidv5 = require('uuid/v5');

module.exports.FileLink = require('./FileLink');

module.exports.rootJoin = require('./rootJoin');
module.exports.isFile = require('./isFile');
module.exports.isDirectory = require('./isDirectory');

module.exports.requireModule = require('./requireModule');
module.exports.requireDirModule = require('./requireDirModule');

module.exports.isClass = require('./isClass');
module.exports.isAsyncFunction = require('./isAsyncFunction');
module.exports.performFunction = require('./performFunction');

module.exports.AesCrypto = require('./AesCrypto');

module.exports.getClientIp = require('./getClientIp');


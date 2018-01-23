/**
 * @Author: zfowed
 * @Date: 2017-12-21 00:16:45
 * @Last Modified by: zfowed
 * @Last Modified time: 2017-12-22 19:49:45
 */



'use strict';

const fs = require('fs');
const path = require('path');

let rootPath = '';

class FileLink {

    constructor(...filePath) {

        filePath = path.join(...filePath);

        this.path = filePath;
    }

    static get rootPath() {
        return rootPath;
    }

    static set rootPath(value) {
        return rootPath = value;
    }

    static of(filePath) {
        return new FileLink(filePath);
    }

    get absolutePath() {
        if (this._absolutePath) return this._absolutePath;

        if (FileLink.rootPath) {
            if (this.path.startsWith(FileLink.rootPath)) {
                this._absolutePath = this.path;
            } else {
                this._absolutePath = path.join(FileLink.rootPath, this.path);
            }
        } else {
            this._absolutePath = this.path;
        }

        return this._absolutePath;
    }

    get resolvePath() {
        if (this._resolvePath) return this._resolvePath;
        if (FileLink.rootPath) {
            this._resolvePath = path.relative(FileLink.rootPath, this.absolutePath);
        } else {
            this._resolvePath = this.absolutePath;
        }
        return this._resolvePath;
    }

    get dirname() {
        if (this._dirname) return this._dirname;
        this._dirname = path.dirname(this.resolvePath);
        return this._dirname;
    }

    get name() {
        if (this._name) return this._name;
        this._name = path.basename(this.resolvePath);
        return this._name;
    }

    get basename() {
        if (this._basename) return this._basename;
        this._basename = path.basename(this.name, this.extname);
        return this._basename;
    }

    get extname() {
        if (this._extname) return this._extname;
        this._extname = path.extname(this.name);
        return this._extname;
    }

    get stats() {
        if (this._stats) return this._stats;
        this._stats = fs.statSync(this.absolutePath);
        return this._stats;
    }

    get exists() {
        if (this._exists) return this._exists;
        this._exists = fs.existsSync(this.absolutePath);
        return this._exists;
    }
    
    get isFile() {
        if (this._isFile) return this._isFile;
        this._isFile = this.exists && this.stats.isFile();
        return this._isFile;
    }

    get isDirectory() {
        if (this._isDirectory) return this._isDirectory;
        this._isDirectory = this.exists && this.stats.isDirectory();
        return this._isDirectory;
    }

    get child() {
        if (!this.isDirectory) throw new Error(`${this.absolutePath} 不是一个文件夹路径`);
        if (this._child) return this._child;
        const readdir = fs.readdirSync(this.absolutePath);
        this._child = readdir.map(item => new FileLink(path.join(this.absolutePath, item)));
        return this._child;
    }

    get childdir() {
        return this.child.filter(item => item.isDirectory);
    }

    get childFile() {
        return this.child.filter(item => item.isFile);
    }

    get module() {
        if (this._module) return this._module;

        try {
            if (this.isFile && (this.extname === '.js' || this.extname === '.json')) {
                this._module = require(this.absolutePath);
            } else if (this.isDirectory) {
                const file = this.childFile.find(item => item.name === 'index.js');
                if (file && file.isFile) {
                    this._module = require(this.absolutePath);
                } else {
                    throw new Error(`${this.absolutePath} 不是一个模块路径`);
                }
            } else {
                throw new Error(`${this.absolutePath} 不是一个模块路径`);
            }
        } catch (error) {
            throw error;
        }

        return this._module;
    }

}

module.exports = FileLink;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electronconifg = require("electron-config");
var chokidar = require("chokidar");
var location_1 = require("./location");
var sorter_1 = require("./sorter");
var config = new electronconifg();
var Watcher = /** @class */ (function () {
    function Watcher() {
        this.watcher = null;
        this.createWatcher();
    }
    Watcher.prototype.createWatcher = function () {
        var directory = config.get('downloadsPath');
        if (!this.watcher) {
            this.watcher = chokidar.watch(directory, {
                ignored: this.getIgnored(directory),
                persistent: true,
                depth: 0
            });
            this.watcher.on('add', function (path) {
                setTimeout(function () {
                    sorter_1.default.sort(path)
                        .then(function () {
                        console.log("File: " + path + " sorter");
                    })
                        .catch(function (err) { return console.error; });
                }, config.get('sortingDelay'));
            });
        }
    };
    Watcher.prototype.getIgnored = function (directory) {
        var ignoredFiles = [];
        var ignored = config.get('ignoredFiles');
        Object.keys(ignored).forEach(function (label) {
            ignoredFiles.push(ignored[label]);
        });
        return ignoredFiles;
    };
    Watcher.prototype.addIgnore = function (rule) {
        this.watcher.unwatch(rule);
    };
    Watcher.prototype.watch = function (rule) {
        this.watcher.add(rule);
    };
    Watcher.prototype.enableWatching = function () {
        location_1.default.createFolders();
        if (this.watcher == null) {
            this.createWatcher();
        }
    };
    Watcher.prototype.disableWatching = function () {
        this.watcher.close();
        this.watcher = null;
    };
    return Watcher;
}());
exports.default = Watcher;
//# sourceMappingURL=watcher.js.map
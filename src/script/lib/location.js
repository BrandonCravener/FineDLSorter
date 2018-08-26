"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var es6_promise_1 = require("es6-promise");
var fs_1 = require("fs");
var path_1 = require("path");
var electron_1 = require("electron");
var electronconfig = require("electron-config");
var config = new electronconfig();
var Location = /** @class */ (function () {
    function Location() {
    }
    Location.getNewLocation = function (path) {
        var sortingConfig = config.get('sortingConfig');
        var fileExt = path_1.extname(path).toLowerCase();
        var complete = false;
        for (var i = 0; i < Object.keys(sortingConfig).length; i += 1) {
            var folder = Object.keys(sortingConfig)[i];
            if (sortingConfig[folder].includes(fileExt)) {
                complete = true;
                return path_1.dirname(path) + "/" + folder + "/" + path_1.basename(path);
            }
        }
        if (!complete) {
            if (config.get('others')) {
                return path_1.dirname(path) + "/" + config.get('othersName') + "/" + path_1.basename(path);
            }
            else {
                return path_1.dirname(path) + "/" + path_1.basename(path);
            }
        }
    };
    Location.createFolders = function (disableSafeCheck) {
        if (disableSafeCheck === void 0) { disableSafeCheck = false; }
        return new es6_promise_1.Promise(function (resolve, reject) {
            var otherEnabled = config.get('others');
            var otherName = config.get('othersName');
            var sortDir = config.get('downloadsPath');
            var sortingConfig = config.get('sortingConfig');
            if (sortDir.indexOf(os_1.homedir()) === -1 && !disableSafeCheck) {
                reject(Error('Location has to be in users base directory!'));
            }
            else {
                var _loop_1 = function (i) {
                    var name_1 = Object.keys(sortingConfig)[i];
                    if (name_1 !== 'others_name') {
                        fs_1.access(sortDir + "/" + name_1, function (err) {
                            if (err) {
                                fs_1.mkdir(sortDir + "/" + name_1, function (error) {
                                    if (error) {
                                        reject(error);
                                    }
                                });
                            }
                        });
                    }
                };
                for (var i = 0; i < Object.keys(sortingConfig).length; i += 1) {
                    _loop_1(i);
                }
                if (otherEnabled) {
                    fs_1.access(sortDir + "/" + otherName, function (err) {
                        if (err) {
                            fs_1.mkdirSync(sortDir + "/" + otherName);
                        }
                    });
                }
                resolve();
            }
        });
    };
    Location.renameMisc = function (newName) {
        var oldName = config.get('othersName');
        var directory = config.get('downloadsPath');
        var oldFolder = path_1.join(directory, oldName);
        var newFolder = path_1.join(directory, newName);
        fs_1.rename(oldFolder, newFolder, function (err) {
            if (err) {
                electron_1.dialog.showErrorBox('Rename Other', 'I was unable to rename the Other folder, please make sure everything in that folder is closed!');
            }
            else {
                config.set('othersName', newName);
            }
        });
    };
    return Location;
}());
exports.default = Location;
//# sourceMappingURL=location.js.map
"use strict";
exports.__esModule = true;
var location_1 = require("./location");
var fs_1 = require("fs");
var es6_promise_1 = require("es6-promise");
var Sorter = /** @class */ (function () {
    function Sorter() {
    }
    Sorter.sort = function (path) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var newLocation = location_1["default"].getNewLocation(path);
            if (newLocation !== path) {
                fs_1.rename(path, newLocation, function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    };
    return Sorter;
}());
exports["default"] = Sorter;

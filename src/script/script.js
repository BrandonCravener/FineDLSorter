"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var watcher_1 = require("./lib/watcher");
var location_1 = require("./lib/location");
var electron_1 = require("electron");
var electronconfig = require("electron-config");
var watcher = new watcher_1.default();
var config = new electronconfig();
function handleEnable(enabled) {
    if (enabled) {
        watcher.enableWatching();
    }
    else {
        watcher.disableWatching();
    }
}
handleEnable(config.get('enabled'));
electron_1.ipcRenderer.on('enable', function (event, enabled) {
    handleEnable(enabled);
});
electron_1.ipcRenderer.on('otherName', function (event, name) {
    location_1.default.renameMisc(name);
});
//# sourceMappingURL=script.js.map
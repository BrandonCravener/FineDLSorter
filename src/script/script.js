"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var watcher_1 = require("./lib/watcher");
var electron_1 = require("electron");
var watcher = new watcher_1.default();
electron_1.ipcRenderer.on('enable', function (event, enabled) {
    console.log(enabled);
    if (enabled) {
        watcher.enableWatching();
    }
    else {
        watcher.disableWatching();
    }
});
//# sourceMappingURL=script.js.map
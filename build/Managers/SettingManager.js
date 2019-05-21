"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var SettingManager = /** @class */ (function () {
    function SettingManager() {
    }
    SettingManager.getSetting = function (name) {
        //settings are read from the .env file at the root of application
        return process.env[name];
    };
    return SettingManager;
}());
exports.SettingManager = SettingManager;
//# sourceMappingURL=SettingManager.js.map
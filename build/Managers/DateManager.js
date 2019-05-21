"use strict";
//DateManager requires dateformat and @types/dateformat
//npm i -S dateformat
//npm i -S @types/dateformat
//http://stevenlevithan.com/assets/misc/date.format.js
Object.defineProperty(exports, "__esModule", { value: true });
var dateFormat = require("dateformat");
var DateManager = /** @class */ (function () {
    function DateManager() {
    }
    DateManager.getUtcDateString = function () {
        //mimics the date time format used by SQL Sever, as if running GetUtcDate() SQL system function
        var date = new Date();
        var msStr = dateFormat(date, ".l");
        var isoDateStr = dateFormat(date, "isoUtcDateTime");
        var dateStr = isoDateStr.replace("T", " ").replace("Z", msStr);
        return dateStr;
    };
    DateManager.defaultLastAnalysisDate = "1970-01-01 00:00:00.000";
    return DateManager;
}());
exports.DateManager = DateManager;
//# sourceMappingURL=DateManager.js.map
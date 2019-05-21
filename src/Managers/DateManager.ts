//DateManager requires dateformat and @types/dateformat
//npm i -S dateformat
//npm i -S @types/dateformat
//http://stevenlevithan.com/assets/misc/date.format.js

import dateFormat = require("dateformat");

export class DateManager {
    
    static getUtcDateString = () : string => {
        //mimics the date time format used by SQL Sever, as if running GetUtcDate() SQL system function
        const date = new Date()
        const msStr = dateFormat(date, ".l")
        const isoDateStr = dateFormat(date, "isoUtcDateTime")
        const dateStr = isoDateStr.replace("T", " ").replace("Z", msStr)
        return dateStr
    }

    static defaultLastAnalysisDate = "1970-01-01 00:00:00.000"

}
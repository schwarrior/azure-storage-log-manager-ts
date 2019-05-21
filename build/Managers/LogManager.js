"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var storage_blob_1 = require("@azure/storage-blob");
var storage_blob_2 = require("@azure/storage-blob");
var SettingManager_1 = require("./SettingManager");
var DateManager_1 = require("./DateManager");
var LogManager = /** @class */ (function () {
    function LogManager() {
        var _this = this;
        this.getLogLines = function (fileName) { return __awaiter(_this, void 0, void 0, function () {
            var appendBlobUrl, downloadResponse, rawRead, fullLog, lines;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appendBlobUrl = storage_blob_2.AppendBlobURL.fromContainerURL(this.containerUrl, fileName);
                        return [4 /*yield*/, appendBlobUrl.download(this.azureStorageOpAborter, 0)];
                    case 1:
                        downloadResponse = _a.sent();
                        return [4 /*yield*/, this.streamToString(downloadResponse.readableStreamBody)];
                    case 2:
                        rawRead = _a.sent();
                        if (!rawRead) {
                            console.log("Read of " + fileName + " resulted in null");
                            return [2 /*return*/, new Array()];
                        }
                        fullLog = rawRead.toString();
                        if (!fullLog) {
                            console.log("Read of " + fileName + " resulted in empty string");
                            return [2 /*return*/, new Array()];
                        }
                        fullLog = fullLog.trim();
                        if (fullLog.length === 0) {
                            return [2 /*return*/, new Array()];
                        }
                        lines = fullLog.split("\r\n");
                        return [2 /*return*/, lines];
                }
            });
        }); };
        this._containerFiles = null;
        this.writeToLog = function (logFileName, message) { return __awaiter(_this, void 0, void 0, function () {
            var timeStampFormatted, logThis, appendBlobUrl, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        timeStampFormatted = DateManager_1.DateManager.getUtcDateString();
                        logThis = timeStampFormatted + "\t" + message;
                        logThis += "\r\n";
                        return [4 /*yield*/, this.getFileRefAndCreateIfNotExists(logFileName)];
                    case 1:
                        appendBlobUrl = _a.sent();
                        return [4 /*yield*/, appendBlobUrl.appendBlock(this.azureStorageOpAborter, logThis, logThis.length)];
                    case 2:
                        _a.sent();
                        console.log(logFileName + ": " + logThis.trim());
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getFileRefAndCreateIfNotExists = function (fileName) { return __awaiter(_this, void 0, void 0, function () {
            var existingFiles, appendBlobUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.containerFiles];
                    case 1:
                        existingFiles = _a.sent();
                        appendBlobUrl = storage_blob_2.AppendBlobURL.fromContainerURL(this.containerUrl, fileName);
                        if (!!existingFiles.includes(fileName)) return [3 /*break*/, 3];
                        return [4 /*yield*/, appendBlobUrl.create(this.azureStorageOpAborter)
                            //force refresh of container files array
                        ];
                    case 2:
                        _a.sent();
                        //force refresh of container files array
                        this._containerFiles = null;
                        _a.label = 3;
                    case 3: return [2 /*return*/, appendBlobUrl];
                }
            });
        }); };
        // A helper method used to read a Node.js readable stream into string
        // adapted from https://github.com/Azure/azure-storage-js
        this.streamToString = function (readableStream) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var chunks = [];
                        readableStream.on("data", function (data) {
                            chunks.push(data.toString());
                        });
                        readableStream.on("end", function () {
                            resolve(chunks.join(""));
                        });
                        readableStream.on("error", reject);
                    })];
            });
        }); };
        var storageaccount = SettingManager_1.SettingManager.getSetting("storageaccount");
        var storageaccesskey = SettingManager_1.SettingManager.getSetting("storageaccesskey");
        var storagecontainername = SettingManager_1.SettingManager.getSetting("storagecontainername");
        var credentials = new storage_blob_1.SharedKeyCredential(storageaccount, storageaccesskey);
        var pipeline = storage_blob_1.StorageURL.newPipeline(credentials);
        var serviceUrl = new storage_blob_2.ServiceURL("https://" + storageaccount + ".blob.core.windows.net", pipeline);
        this.containerUrl = storage_blob_2.ContainerURL.fromServiceURL(serviceUrl, storagecontainername);
        this.azureStorageOpAborter = storage_blob_2.Aborter.timeout(20 * 60 * 1000); // twenty mins
    }
    Object.defineProperty(LogManager.prototype, "containerFiles", {
        get: function () {
            var _this = this;
            return (function () { return __awaiter(_this, void 0, void 0, function () {
                var azResponse, azMarker, _i, _a, blob;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this._containerFiles) {
                                return [2 /*return*/, this._containerFiles];
                            }
                            this._containerFiles = new Array();
                            _b.label = 1;
                        case 1: return [4 /*yield*/, this.containerUrl.listBlobFlatSegment(this.azureStorageOpAborter)];
                        case 2:
                            azResponse = _b.sent();
                            azMarker = azResponse.marker;
                            for (_i = 0, _a = azResponse.segment.blobItems; _i < _a.length; _i++) {
                                blob = _a[_i];
                                //omit files in subdirectories
                                if (blob.name.indexOf("/") > -1) {
                                    continue;
                                }
                                this._containerFiles.push(blob.name);
                            }
                            _b.label = 3;
                        case 3:
                            if (azMarker) return [3 /*break*/, 1];
                            _b.label = 4;
                        case 4: return [2 /*return*/, this._containerFiles];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    return LogManager;
}());
exports.LogManager = LogManager;
//# sourceMappingURL=LogManager.js.map
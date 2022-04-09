"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.creatGCUpload = exports.deleteFilesFromGC = exports.deleteFromGC = exports.deleteAllUserImages = void 0;
var fileNaming_1 = require("../utils/fileNaming");
var index_1 = require("../index");
var path = __importStar(require("path"));
var constants_1 = require("../constants/");
var creatGCUpload = function (image_set, _id) {
    var promise = Promise.all(image_set.map(function (image) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, filename, mimetype, encoding, createReadStream, sanitizedFilename, fileLocation, gcFile, data, displayData;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, image.file];
                            case 1:
                                _a = _b.sent(), filename = _a.filename, mimetype = _a.mimetype, encoding = _a.encoding, createReadStream = _a.createReadStream;
                                sanitizedFilename = (0, fileNaming_1.sanitizeFile)(filename, _id);
                                fileLocation = path.join(constants_1.dest_gcs_images, _id, sanitizedFilename);
                                console.log(fileLocation);
                                gcFile = index_1.acsport1.file(fileLocation);
                                displayData = {
                                    imageURL: "",
                                    filePath: "",
                                };
                                createReadStream().pipe(gcFile
                                    .createWriteStream()
                                    .on("finish", function () {
                                    gcFile.makePublic();
                                    data = {
                                        img_idx: image.img_idx,
                                        imageURL: "https://storage.googleapis.com/acsport1/".concat(fileLocation),
                                        filePath: "".concat(fileLocation),
                                    };
                                    displayData = {
                                        imageURL: "https://storage.googleapis.com/acsport1/".concat(fileLocation),
                                        filePath: "".concat(fileLocation),
                                    };
                                    console.log("done");
                                    resolve(data);
                                })
                                    .on("error", function (error) {
                                    console.log("error");
                                    console.log(error);
                                    reject();
                                }));
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    }); }));
    return promise;
};
exports.creatGCUpload = creatGCUpload;
var deleteAllUserImages = function (image_set) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // remove from gc AND mongdb
            return [4 /*yield*/, new Promise(function (resolve, reject) {
                    try {
                        image_set.map(function (imageObj) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("imageObj", imageObj.filePath);
                                        return [4 /*yield*/, deleteFromGC(imageObj.filePath)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        resolve();
                    }
                    catch (_a) {
                        reject();
                    }
                })];
            case 1:
                // remove from gc AND mongdb
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteAllUserImages = deleteAllUserImages;
var deleteFilesFromGC = function (files_to_del, original_uploaded_image_set, add_local_images_length) { return __awaiter(void 0, void 0, void 0, function () {
    var img_idx_del_1, filtered_array;
    return __generator(this, function (_a) {
        // remove from gc AND mongdb
        // remove from mongoDb
        // ote sure about wehen one image is left check again
        console.log("where does it go");
        if (original_uploaded_image_set.length - files_to_del.length + add_local_images_length >= 1) {
            img_idx_del_1 = files_to_del.map(function (imgObj) { return imgObj.img_idx; });
            filtered_array = original_uploaded_image_set.filter(function (imgObj) { return !img_idx_del_1.includes(imgObj.img_idx); });
            console.log("check filtered again", filtered_array);
            files_to_del.map(function (file_to_del) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, deleteFromGC(file_to_del.filePath)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/, filtered_array];
        }
        else {
            return [2 /*return*/, original_uploaded_image_set];
        }
        return [2 /*return*/];
    });
}); };
exports.deleteFilesFromGC = deleteFilesFromGC;
var deleteFromGC = function (file_to_del) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, index_1.acsport1.file(file_to_del).delete().then(function () {
                    console.log("file ".concat(file_to_del, " deleted"));
                })
                    .catch(function (error) {
                    console.log(error);
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteFromGC = deleteFromGC;

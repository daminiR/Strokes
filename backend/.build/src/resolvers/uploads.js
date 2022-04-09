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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
var Squash_1 = __importDefault(require("../models/Squash"));
var graphql_upload_1 = require("graphql-upload");
var fileNaming_1 = require("../utils/fileNaming");
var index_1 = require("../index");
var path = __importStar(require("path"));
var googleUpload_1 = require("../utils/googleUpload");
var constants_1 = require("../constants/");
exports.resolvers = {
    FileUpload: graphql_upload_1.GraphQLUpload,
    Mutation: {
        deleteImage: function (parents, _a, context, info) {
            var _id = _a._id, img_idx = _a.img_idx;
            return __awaiter(void 0, void 0, void 0, function () {
                var filter, update, squash_doc, file_to_del;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            filter = { _id: _id };
                            update = { $pull: { image_set: { img_idx: img_idx } } };
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate(filter, update, {
                                    new: false,
                                })];
                        case 1:
                            squash_doc = _b.sent();
                            file_to_del = squash_doc.image_set.find(function (image_info) { return image_info.img_idx === img_idx; }).filePath;
                            return [4 /*yield*/, (0, googleUpload_1.deleteFromGC)(file_to_del)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, squash_doc.image_set];
                    }
                });
            });
        },
        uploadFile: function (parents, _a, context, info) {
            var file = _a.file, _id = _a._id, img_idx = _a.img_idx;
            return __awaiter(void 0, void 0, void 0, function () {
                var _b, filename, mimetype, encoding, createReadStream, sanitizedFilename, gcFile, data, displayData, squash_val;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, file];
                        case 1:
                            _b = _c.sent(), filename = _b.filename, mimetype = _b.mimetype, encoding = _b.encoding, createReadStream = _b.createReadStream;
                            sanitizedFilename = (0, fileNaming_1.sanitizeFile)(filename, _id);
                            gcFile = index_1.acsport1.file(path.join(constants_1.dest_gcs_images, sanitizedFilename));
                            displayData = {
                                imageURL: "",
                                filePath: "",
                            };
                            return [4 /*yield*/, Squash_1.default.findById(_id)];
                        case 2:
                            squash_val = _c.sent();
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    createReadStream().pipe(gcFile
                                        .createWriteStream()
                                        .on("finish", function () {
                                        gcFile.makePublic();
                                        data = {
                                            img_idx: img_idx,
                                            imageURL: "https://storage.googleapis.com/acsport1/".concat(constants_1.dest_gcs_images, "/").concat(sanitizedFilename),
                                            filePath: "".concat(constants_1.dest_gcs_images, "/").concat(sanitizedFilename),
                                        };
                                        displayData = {
                                            imageURL: "https://storage.googleapis.com/acsport1/".concat(constants_1.dest_gcs_images, "/").concat(sanitizedFilename),
                                            filePath: "".concat(constants_1.dest_gcs_images, "/").concat(sanitizedFilename),
                                        };
                                        console.log("done");
                                        resolve();
                                    })
                                        .on("error", function (error) {
                                        console.log("error");
                                        console.log(error);
                                        reject();
                                    }));
                                }).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var doc, file_to_del, filter, update, doc;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(squash_val.image_set.find(function (image_info) { return image_info.img_idx === img_idx; }) === undefined)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: _id }, { $push: { image_set: data } }, { new: true })];
                                            case 1:
                                                doc = _a.sent();
                                                console.log(doc);
                                                return [3 /*break*/, 5];
                                            case 2:
                                                file_to_del = squash_val.image_set
                                                    .find(function (image_info) { return image_info.img_idx === img_idx; })
                                                    .filePath.toString();
                                                return [4 /*yield*/, (0, googleUpload_1.deleteFromGC)(file_to_del)];
                                            case 3:
                                                _a.sent();
                                                filter = {
                                                    _id: _id,
                                                    image_set: { $elemMatch: { img_idx: img_idx } },
                                                };
                                                update = { $set: { "image_set.$": data } };
                                                return [4 /*yield*/, Squash_1.default.findOneAndUpdate(filter, update, {
                                                        new: true,
                                                    })];
                                            case 4:
                                                doc = _a.sent();
                                                console.log(doc);
                                                _a.label = 5;
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 3:
                            _c.sent();
                            return [2 /*return*/, displayData];
                    }
                });
            });
        },
    }
};
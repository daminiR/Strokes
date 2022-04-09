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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFile = void 0;
var crypto = __importStar(require("crypto"));
var moment_1 = __importDefault(require("moment"));
var generateRandomString = function (size) {
    var random_string = '-'.concat(crypto.randomBytes(size).toString('hex'));
    return random_string;
};
var sanitizeFile = function (filename, _uid) {
    var curTime = (0, moment_1.default)().format("YYYYMMDDhhmmss");
    var random_string = generateRandomString(10);
    var sanitizedName = curTime.concat(random_string);
    sanitizedName = sanitizedName.concat('-'.concat(_uid));
    sanitizedName = sanitizedName.concat('-'.concat(filename));
    return sanitizedName;
};
exports.sanitizeFile = sanitizeFile;

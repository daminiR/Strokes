"use strict";
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
var lodash_1 = __importDefault(require("lodash"));
var constants_1 = require("../constants/");
exports.resolvers = {
    Mutation: {
        updateGameLevelsToStrings: function (parents, context, info) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //const doc = await Squash.updateMany(
                //{ _id: ["aoshwaakxrywljjshsgxuvytfzlm"]},
                //{ $set: {"sports.$[].game_level":  '1'}},
                //{ new: true }
                //);
                console.log("tetsing");
                return [2 /*return*/];
            });
        }); },
        updateLikesTestSamples: function (parents, _a, context, info) {
            var _id = _a._id, likes = _a.likes;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc, profileImage, likedByUser, filter, update;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: _id }, { $addToSet: { likes: { $each: likes } } }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            profileImage = lodash_1.default.find(doc === null || doc === void 0 ? void 0 : doc.image_set, function (imgObj) { imgObj.img_idx == 0; });
                            likedByUser = {
                                first_name: doc === null || doc === void 0 ? void 0 : doc.first_name,
                                _id: _id,
                                age: doc === null || doc === void 0 ? void 0 : doc.age,
                                profileImage: profileImage,
                            };
                            filter = { _id: likes };
                            update = { $addToSet: { likedByUSers: likedByUser } };
                            return [4 /*yield*/, Squash_1.default.updateMany(filter, update)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, doc];
                    }
                });
            });
        },
        updateLikesCurrentUserTestSamples: function (parents, _a, context, info) {
            var _id = _a._id, likes = _a.likes;
            return __awaiter(void 0, void 0, void 0, function () {
                var likeIDs, likedDocs, filter, update, doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            likeIDs = lodash_1.default.map(likes, function (likeObj) {
                                return likeObj._id;
                            });
                            return [4 /*yield*/, Squash_1.default.updateMany({ _id: { $in: likeIDs } }, { $addToSet: { likes: _id } }, { new: true })];
                        case 1:
                            likedDocs = _b.sent();
                            filter = { _id: _id };
                            update = { $addToSet: { likedByUSers: { $each: likes } } };
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate(filter, update)];
                        case 2:
                            doc = _b.sent();
                            return [2 /*return*/, doc];
                    }
                });
            });
        },
        updateUserProfileTestSamples: function (parents, _a, context, info) {
            var _id1 = _a._id1, _id2 = _a._id2;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Squash_1.default.updateMany({}, 
                            //{ $pull: { matches: {}, likes: {}, likedByUSers: {}} },
                            { $set: { "sports.$[].game_level": lodash_1.default.random(0, 2).toString() } }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            console.log("tetsing", doc);
                            return [2 /*return*/, doc];
                    }
                });
            });
        },
        createSquashTestSamples: function (root, _a) {
            var _id = _a._id, image_set = _a.image_set, first_name = _a.first_name, last_name = _a.last_name, gender = _a.gender, age = _a.age, sports = _a.sports, location = _a.location, description = _a.description;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Squash_1.default.create({
                                _id: _id,
                                image_set: image_set,
                                first_name: first_name,
                                last_name: last_name,
                                gender: gender,
                                age: age,
                                sports: sports,
                                location: location,
                                description: description,
                                swipesPerDay: constants_1.SWIPIES_PER_DAY_LIMIT + constants_1.LIKES_PER_DAY_LIMIT,
                                visableLikePerDay: constants_1.LIKES_PER_DAY_LIMIT,
                                sportChangesPerDay: constants_1.SPORT_CHANGES_PER_DAY,
                                i_blocked: [],
                                blocked_me: [],
                                likes: [],
                                dislikes: [],
                                active: true,
                            })];
                        case 1:
                            doc = _b.sent();
                            console.log(doc);
                            return [2 /*return*/, doc];
                    }
                });
            });
        },
        testMut: function (root, args) {
            return args.name;
        },
    }
};

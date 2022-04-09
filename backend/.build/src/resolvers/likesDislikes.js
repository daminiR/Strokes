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
exports.resolvers = {
    Query: {
        getSwipesPerDay: function (parents, _a, context, info) {
            var _id = _a._id;
            return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Squash_1.default.findById(_id)];
                        case 1:
                            user = _b.sent();
                            return [2 /*return*/, user ? user.swipesPerDay : 0];
                    }
                });
            });
        }
    },
    Mutation: {
        updateLikes: function (parents, _a, context, info) {
            var _id = _a._id, likes = _a.likes, currentUserData = _a.currentUserData, isFromLikes = _a.isFromLikes;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc, filter, likedByUser, update, doc, filter, likedByUser, update;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // the one who swiped get one less swipe so for _id, decease swipe
                            // only upser documents if likes/dislikes are more than 0
                            console.log("what is isFromLikes", isFromLikes);
                            if (!!isFromLikes) return [3 /*break*/, 3];
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ $and: [{ _id: _id }, { $gt: { swipesPerDay: 0 } }] }, {
                                    $addToSet: { likes: { $each: likes } },
                                    $inc: { swipesPerDay: -1 },
                                }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            filter = { _id: likes };
                            likedByUser = {
                                first_name: doc === null || doc === void 0 ? void 0 : doc.first_name,
                                _id: _id,
                                age: doc === null || doc === void 0 ? void 0 : doc.age,
                                gender: doc === null || doc === void 0 ? void 0 : doc.gender,
                                sports: doc === null || doc === void 0 ? void 0 : doc.sports,
                                description: doc === null || doc === void 0 ? void 0 : doc.description,
                                image_set: doc === null || doc === void 0 ? void 0 : doc.image_set,
                                location: doc === null || doc === void 0 ? void 0 : doc.location,
                            };
                            update = { $addToSet: { likedByUSers: likedByUser } };
                            return [4 /*yield*/, Squash_1.default.updateMany(filter, update)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, doc];
                        case 3: return [4 /*yield*/, Squash_1.default.findOneAndUpdate({
                                $and: [
                                    { _id: _id },
                                    { $gt: { swipesPerDay: 0, visableLikePerDay: 0 } },
                                ],
                            }, {
                                $addToSet: { likes: { $each: likes } },
                                $inc: { swipesPerDay: -1, visableLikePerDay: -1 },
                            }, { new: true })];
                        case 4:
                            doc = _b.sent();
                            filter = { _id: likes };
                            likedByUser = {
                                first_name: doc === null || doc === void 0 ? void 0 : doc.first_name,
                                _id: _id,
                                age: doc === null || doc === void 0 ? void 0 : doc.age,
                                gender: doc === null || doc === void 0 ? void 0 : doc.gender,
                                sports: doc === null || doc === void 0 ? void 0 : doc.sports,
                                description: doc === null || doc === void 0 ? void 0 : doc.description,
                                image_set: doc === null || doc === void 0 ? void 0 : doc.image_set,
                                location: doc === null || doc === void 0 ? void 0 : doc.location,
                            };
                            update = { $addToSet: { likedByUSers: likedByUser } };
                            return [4 /*yield*/, Squash_1.default.updateMany(filter, update)];
                        case 5:
                            _b.sent();
                            return [2 /*return*/, doc];
                    }
                });
            });
        },
        updateDislikes: function (parents, _a, context, info) {
            var _id = _a._id, dislikes = _a.dislikes, isFromLikes = _a.isFromLikes;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc, doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!!isFromLikes) return [3 /*break*/, 2];
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ $and: [{ _id: _id }, { $gt: { swipesPerDay: 0 } }] }, {
                                    $addToSet: { dislikes: { $each: dislikes } },
                                    $inc: { swipesPerDay: -1 },
                                }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            console.log("Updated user dislikes ", dislikes);
                            console.log("doc", doc);
                            return [2 /*return*/, doc];
                        case 2: return [4 /*yield*/, Squash_1.default.findOneAndUpdate({
                                $and: [
                                    { _id: _id },
                                    { $gt: { swipesPerDay: 0, visableLikePerDay: 0 } },
                                ],
                            }, {
                                $addToSet: { dislikes: { $each: dislikes } },
                                $inc: { swipesPerDay: -1, visableLikePerDay: -1 },
                            }, { new: true })];
                        case 3:
                            doc = _b.sent();
                            console.log("Updated user dislikes ", dislikes);
                            console.log("doc", doc);
                            return [2 /*return*/, doc];
                    }
                });
            });
        },
    },
};

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
var googleUpload_1 = require("../utils/googleUpload");
var constants_1 = require("../constants/");
exports.resolvers = {
    Query: {
        squash: function (parents, args, context, info) { return __awaiter(void 0, void 0, void 0, function () {
            var squash_val;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Squash_1.default.findById(args.id)];
                    case 1:
                        squash_val = _a.sent();
                        console.log(squash_val);
                        return [2 /*return*/, squash_val];
                }
            });
        }); },
        squashes: function (parents, args, context, info) { return __awaiter(void 0, void 0, void 0, function () {
            var squashes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Squash_1.default.find({})];
                    case 1:
                        squashes = _a.sent();
                        return [2 /*return*/, squashes];
                }
            });
        }); },
    },
    Mutation: {
        //////////////////////////////////////// JMETER Testing MUtations ////////////////////////////////////////////////
        updateLocation: function (parents, _a, context, info) {
            var check = _a.check;
            return __awaiter(void 0, void 0, void 0, function () {
                var locationAll, docs;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            locationAll = {
                                city: "Cambridge",
                                state: "MA",
                                country: "US"
                            };
                            return [4 /*yield*/, Squash_1.default.updateMany({}, { $set: { location: locationAll } }, { new: true })];
                        case 1:
                            docs = _b.sent();
                            console.log("Updated user location changes", docs);
                            return [2 /*return*/, "Done"];
                    }
                });
            });
        },
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        updateUserSports: function (parents, _a, context, info) {
            var _id = _a._id, sportsList = _a.sportsList;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(sportsList.length != 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: _id }, { $set: { sports: sportsList } }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            console.log("Updated user squash changes");
                            _b.label = 2;
                        case 2: return [2 /*return*/, _id];
                    }
                });
            });
        },
        updateName: function (parents, _a, context, info) {
            var _id = _a._id, first_name = _a.first_name, last_name = _a.last_name;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("did we get here");
                            if (!(first_name.length != 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: _id }, { $set: { first_name: first_name, last_name: last_name } }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            console.log("Updated user first name ", first_name, last_name);
                            return [3 /*break*/, 3];
                        case 2:
                            console.log("Name cannot be no length");
                            _b.label = 3;
                        case 3: return [2 /*return*/, _id];
                    }
                });
            });
        },
        updateAge: function (parents, _a, context, info) {
            var _id = _a._id, age = _a.age;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(age != 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: _id }, { $set: { age: age } }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            console.log("Updated user age ", age);
                            return [3 /*break*/, 3];
                        case 2:
                            console.log("Age cannot be no length");
                            _b.label = 3;
                        case 3: return [2 /*return*/, _id];
                    }
                });
            });
        },
        updateGender: function (parents, _a, context, info) {
            var _id = _a._id, gender = _a.gender;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: _id }, { $set: { gender: gender } }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            console.log("Updated user gender ", gender);
                            //} else {
                            //console.log("Age cannot be no length");
                            //}
                            return [2 /*return*/, _id];
                    }
                });
            });
        },
        updateDescription: function (parents, _a, context, info) {
            var _id = _a._id, description = _a.description;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: _id }, { $set: { description: description } }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            console.log("Updated user description ", description);
                            //} else {
                            //console.log("Age cannot be no length");
                            //}
                            return [2 /*return*/, _id];
                    }
                });
            });
        },
        updateUserProfile: function (root, _a) {
            var _id = _a._id, image_set = _a.image_set, first_name = _a.first_name, last_name = _a.last_name, gender = _a.gender, age = _a.age, sports = _a.sports, location = _a.location, description = _a.description, remove_uploaded_images = _a.remove_uploaded_images, add_local_images = _a.add_local_images, original_uploaded_image_set = _a.original_uploaded_image_set;
            return __awaiter(void 0, void 0, void 0, function () {
                var removed_image_set, data_set, final_image_set, check_doc_sports, sportChangesPerDay, sportsOld, sportsNew, doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, googleUpload_1.deleteFilesFromGC)(remove_uploaded_images, original_uploaded_image_set, add_local_images.length)];
                        case 1:
                            removed_image_set = _b.sent();
                            return [4 /*yield*/, (0, googleUpload_1.creatGCUpload)(add_local_images, _id)];
                        case 2:
                            data_set = _b.sent();
                            final_image_set = removed_image_set.concat(data_set);
                            return [4 /*yield*/, Squash_1.default.findById(_id)];
                        case 3:
                            check_doc_sports = _b.sent();
                            sportChangesPerDay = check_doc_sports === null || check_doc_sports === void 0 ? void 0 : check_doc_sports.sportChangesPerDay;
                            sportsOld = lodash_1.default.map(check_doc_sports === null || check_doc_sports === void 0 ? void 0 : check_doc_sports.sports, function (sportObj) { return sportObj.sport; });
                            sportsNew = lodash_1.default.map(sports, function (sportObj) { return sportObj.sport; });
                            //if (!_.isEqual(sportsOld, sportsNew)) {
                            if (!lodash_1.default.isEqual(check_doc_sports === null || check_doc_sports === void 0 ? void 0 : check_doc_sports.sports, sports)) {
                                sportChangesPerDay = sportChangesPerDay
                                    ? sportChangesPerDay - 1
                                    : constants_1.SPORT_CHANGES_PER_DAY;
                            }
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: _id }, {
                                    $set: {
                                        _id: _id,
                                        image_set: final_image_set,
                                        first_name: first_name,
                                        last_name: last_name,
                                        gender: gender,
                                        location: location,
                                        age: age,
                                        sports: sports,
                                        description: description,
                                        sportChangesPerDay: sportChangesPerDay,
                                    },
                                }, { new: true })];
                        case 4:
                            doc = _b.sent();
                            return [2 /*return*/, doc];
                    }
                });
            });
        },
    }
};

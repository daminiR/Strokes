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
var Messages_1 = __importDefault(require("../models/Messages"));
var fileNaming_1 = require("../utils/fileNaming");
var index_1 = require("../index");
var path = __importStar(require("path"));
var lodash_1 = __importDefault(require("lodash"));
//import { PubSub } from 'graphql-subscriptions';
//import { pubsub } from '../pubsub'
//const pubsub = new PubSub()
var SWIPIES_PER_DAY_LIMIT = 10;
var LIKES_PER_DAY_LIMIT = 3;
var SPORT_CHANGES_PER_DAY = 2;
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
                                fileLocation = path.join(dest_gcs_images, _id, sanitizedFilename);
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
var dest_gcs_images = "all_images";
var POST_CHANNEL = 'MESSAGE_CHANNEL';
exports.resolvers = {
    Query: {
        messages: function (parents, _a, context, info) {
            var currentUserID = _a.currentUserID, matchedUserID = _a.matchedUserID, offset = _a.offset, limit = _a.limit;
            return __awaiter(void 0, void 0, void 0, function () {
                var messages;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Messages_1.default.find({
                                $or: [{ sender: currentUserID, receiver: matchedUserID }, { sender: matchedUserID, receiver: currentUserID }]
                            }).sort({ "_id": -1 }).skip(offset).limit(limit)
                            // sort based on objectId
                        ];
                        case 1:
                            messages = _b.sent();
                            // sort based on objectId
                            console.log(messages);
                            return [2 /*return*/, messages];
                    }
                });
            });
        },
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
        },
        checkPhoneInput: function (parents, _a, context, info) {
            var phoneNumber = _a.phoneNumber;
            return __awaiter(void 0, void 0, void 0, function () {
                var filter, user;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            filter = { phoneNumber: phoneNumber };
                            return [4 /*yield*/, Squash_1.default.findOne(filter)];
                        case 1:
                            user = _b.sent();
                            console.log("pphone", user);
                            if (user) {
                                return [2 /*return*/, { isPhoneExist: true, isDeleted: user.deleted ? user.deleted.isDeleted : false }];
                            }
                            else {
                                return [2 /*return*/, { isPhoneExist: false, isDeleted: false }];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        /////////////////////////////////////////////// Jmeter Testing ///////////////////////////////////////
        matchesNotOptim: function (parents, _a, context, info) {
            var _id = _a._id, offset = _a.offset, limit = _a.limit, location = _a.location, sport = _a.sport, game_levels = _a.game_levels, ageRange = _a.ageRange, dislikes = _a.dislikes;
            return __awaiter(void 0, void 0, void 0, function () {
                var minAge, maxAge, filter, users;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            minAge = ageRange.minAge;
                            maxAge = ageRange.maxAge;
                            filter = {
                                $and: [
                                    {
                                        _id: { $ne: _id },
                                    },
                                    {
                                        "location.city": location.city,
                                    },
                                    {
                                        "likes._id": { $ne: _id },
                                    },
                                    {
                                        active: true,
                                    },
                                    {
                                        //sports: { sport: sport, game_level: { $in: game_levels  } },
                                        sports: {
                                            $elemMatch: { sport: sport, game_level: { $in: ["2", "0"] } },
                                        },
                                    },
                                    {
                                        age: { $gt: minAge, $lt: maxAge },
                                    },
                                ],
                            };
                            return [4 /*yield*/, Squash_1.default.find(filter).skip(offset).limit(limit)];
                        case 1:
                            users = _b.sent();
                            console.log("All users that are a potential match to current!", users.length);
                            return [2 /*return*/, users];
                    }
                });
            });
        },
        ////////////////////////////////////////////////////////////////
        queryProssibleMatches: function (parents, _a, context, info) {
            var _id = _a._id, offset = _a.offset, limit = _a.limit, location = _a.location, sport = _a.sport, game_levels = _a.game_levels, ageRange = _a.ageRange;
            return __awaiter(void 0, void 0, void 0, function () {
                var matchingestingFIlter, minAge, maxAge, filter, test_filter, fieldsNeeded, users;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            matchingestingFIlter = [
                                "zlmfnsxombvhhgdaededeywqgrye",
                                "rpdiszrxocuawphcjwfpfartqmjw",
                                "bpikrcdgfptbmcfdxiuhsjtyixvw",
                                "pkimewhaimvhcbffqeomhaxrvago",
                                "umfiemicigdyoewibrkdwcqvqllq",
                                "ezwviwnqurrlxkwfgoapxfsheluo",
                                "tqcnpdeqhnxwszstoqjzeytezloy",
                                "idzlmexjvinaeazrhtmtcikkzdae",
                                "eqiibyvrqlepzlszreecrlxnjmgb",
                                "vrgffumzkdkiqccwtmppfxqgkfuz",
                                "xbymfauwsmsxqiltefpifsewejsn",
                                "qydkdyxagzlmmwhwneysttezjtbc",
                                "tpxwhbgxczdchqtoctketztpxwvm",
                                "ppajvinskckeuuzpokvwbyuquxzl",
                                "nakikrbjpuebtczseojwtkancxki",
                                "onzhxkhugnsacdjlicyqnheprxsq",
                                "efvtocugfomuixmsjthqdglmfzsr",
                                "fmyuiatkqbnlspmtkgcdypwtwdls",
                                "mpmcgtuzyljycxqhtumrshvglnob",
                                "shfycwppdykpzlavlzohrszpnklw",
                                "onifaweiyfdmqnixzgfyqwmkotic",
                                "krnsxazpljpdkapztjvlxzsxnmkc",
                                "pejvchkzlidjyuzpqbgsgfgxqckp",
                                "esjcajqstsrbpyxqcbalypltaxli",
                                "tyhhqcivlnrjhboxfyeshxytgkdu",
                                "sckvatjzhcrxmjavtejhdzjlqwso",
                                "wbunwiospcfrjtzddydmgfzzqqfv",
                                "rqukfbpkivnkoazcesdfkstlstin",
                                "bmuvqdedmagznvvwkccwmsfpukzs",
                            ];
                            minAge = ageRange.minAge;
                            maxAge = ageRange.maxAge;
                            filter = {
                                $and: [
                                    {
                                        _id: { $ne: _id },
                                    },
                                    {
                                        "location.city": location.city,
                                    },
                                    {
                                        active: true,
                                    },
                                    {
                                        sports: {
                                            $elemMatch: { sport: sport, game_level: { $in: game_levels } },
                                        },
                                    },
                                    {
                                        age: { $gt: minAge, $lt: maxAge },
                                    },
                                ],
                            };
                            test_filter = { _id: { $in: matchingestingFIlter } };
                            fieldsNeeded = {
                                _id: 1,
                                first_name: 1,
                                age: 1,
                                gender: 1,
                                sports: 1,
                                description: 1,
                                image_set: 1,
                                location: 1,
                            };
                            return [4 /*yield*/, Squash_1.default.find(test_filter, fieldsNeeded)
                                    .skip(offset)
                                    .limit(limit)];
                        case 1:
                            users = _b.sent();
                            return [2 /*return*/, users];
                    }
                });
            });
        },
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
        display: function (parents, args, context, info) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
    },
    //export   FileUpload: GraphQLUpload,
    //Subscription: {
    //messagePosted: {
    ////subscribe: (parents, args, {pubsub}, info) => pubsub.asyncIterator(POST_CHANNEL)
    //subscribe: () => pubsub.asyncIterator([POST_CHANNEL])
    //},
    //},
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
        //postMessage2: async (parents, {sender, receiver, text}, context, info) => {
        //const id = text.length
        //const messageID = new ObjectId()
        //const createdAt = new Date()
        //pubsub.publish(POST_CHANNEL, {
        //messagePosted: { _id: messageID, sender: sender, receiver: receiver, text: text, createdAt: createdAt}
        //})
        //const doc = await Message.create(
        //{ _id: messageID, sender: sender, receiver: receiver, text: text, createdAt: createdAt}
        //)
        //return id
        //},
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
        updateMatches: function (parents, _a, context, info) {
            var currentUserId = _a.currentUserId, potentialMatchId = _a.potentialMatchId, currentUser = _a.currentUser, potentialMatch = _a.potentialMatch;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc, doc2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: currentUserId }, { $addToSet: { matches: potentialMatch } }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: potentialMatchId }, { $push: { matches: currentUser } }, { new: true })];
                        case 2:
                            doc2 = _b.sent();
                            console.log("doc user", doc);
                            console.log("doc match", doc2);
                            return [2 /*return*/, doc];
                    }
                });
            });
        },
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
                                location: doc === null || doc === void 0 ? void 0 : doc.location
                            };
                            update = { $addToSet: { likedByUSers: likedByUser } };
                            return [4 /*yield*/, Squash_1.default.updateMany(filter, update)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, doc];
                        case 3: return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ $and: [{ _id: _id }, { $gt: { swipesPerDay: 0, visableLikePerDay: 0 } }] }, {
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
                                location: doc === null || doc === void 0 ? void 0 : doc.location
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
                        case 2: return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ $and: [{ _id: _id }, { $gt: { swipesPerDay: 0, visableLikePerDay: 0 } }] }, {
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
                            return [4 /*yield*/, deleteFromGC(file_to_del)];
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
                            gcFile = index_1.acsport1.file(path.join(dest_gcs_images, sanitizedFilename));
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
                                            imageURL: "https://storage.googleapis.com/acsport1/".concat(dest_gcs_images, "/").concat(sanitizedFilename),
                                            filePath: "".concat(dest_gcs_images, "/").concat(sanitizedFilename),
                                        };
                                        displayData = {
                                            imageURL: "https://storage.googleapis.com/acsport1/".concat(dest_gcs_images, "/").concat(sanitizedFilename),
                                            filePath: "".concat(dest_gcs_images, "/").concat(sanitizedFilename),
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
                                                return [4 /*yield*/, deleteFromGC(file_to_del)];
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
        ////////////////////////////////// JMETER TESTS ////////////////////////////////
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
                                swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
                                visableLikePerDay: LIKES_PER_DAY_LIMIT,
                                sportChangesPerDay: SPORT_CHANGES_PER_DAY,
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
        createSquash2: function (root, _a) {
            var _id = _a._id, image_set = _a.image_set, first_name = _a.first_name, last_name = _a.last_name, gender = _a.gender, age = _a.age, sports = _a.sports, location = _a.location, description = _a.description, phoneNumber = _a.phoneNumber, email = _a.email;
            return __awaiter(void 0, void 0, void 0, function () {
                var data_set, doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, creatGCUpload(image_set, _id)];
                        case 1:
                            data_set = _b.sent();
                            return [4 /*yield*/, Squash_1.default.create({
                                    _id: _id,
                                    image_set: data_set,
                                    first_name: first_name,
                                    last_name: last_name,
                                    gender: gender,
                                    age: age,
                                    location: location,
                                    sports: sports,
                                    description: description,
                                    phoneNumber: phoneNumber,
                                    email: email,
                                    active: true,
                                    swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
                                    visableLikePerDay: LIKES_PER_DAY_LIMIT,
                                    sportChangesPerDay: SPORT_CHANGES_PER_DAY,
                                })];
                        case 2:
                            doc = _b.sent();
                            console.log(doc);
                            return [2 /*return*/, doc];
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
                        case 0: return [4 /*yield*/, deleteFilesFromGC(remove_uploaded_images, original_uploaded_image_set, add_local_images.length)];
                        case 1:
                            removed_image_set = _b.sent();
                            return [4 /*yield*/, creatGCUpload(add_local_images, _id)];
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
                                    : SPORT_CHANGES_PER_DAY;
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
        deleteChatUser: function (root, _a) {
            var _idUser = _a._idUser, _idChatUser = _a._idChatUser, UserObj = _a.UserObj, ChatUserObj = _a.ChatUserObj;
            return __awaiter(void 0, void 0, void 0, function () {
                var filter, Users, matchObj, doc, doc2, allMessages, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!!lodash_1.default.isEqual(_idUser, _idChatUser)) return [3 /*break*/, 8];
                            filter = [_idUser, _idChatUser];
                            return [4 /*yield*/, Squash_1.default.find({ '_id': [_idUser, _idChatUser] })];
                        case 1:
                            Users = _b.sent();
                            matchObj = {};
                            lodash_1.default.map(Users, function (userObj) {
                                console.log(userObj._id);
                                console.log(_idUser);
                                if (lodash_1.default.isEqual(userObj._id, _idUser)) {
                                    var potentialDisLike = {
                                        '_id': userObj._id,
                                        'first_name': userObj.first_name,
                                        'age': userObj.age,
                                        'gender': userObj.gender,
                                        'sports': userObj.sports,
                                        'image_set': userObj.image_set,
                                        //TODO: some weird issue with description type
                                        'description': userObj.description.toString(),
                                    };
                                    matchObj[_idUser] = lodash_1.default.concat(userObj.dislikes, potentialDisLike);
                                }
                                if (lodash_1.default.isEqual(userObj._id, _idChatUser)) {
                                    var potentialDisLike = {
                                        '_id': userObj._id,
                                        'first_name': userObj.first_name,
                                        'age': userObj.age,
                                        'gender': userObj.gender,
                                        'sports': userObj.sports,
                                        'image_set': userObj.image_set,
                                        //TODO: some weird issue with description type
                                        'description': userObj.description.toString(),
                                    };
                                    matchObj[_idChatUser] = lodash_1.default.concat(userObj.dislikes, potentialDisLike);
                                }
                            });
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ '_id': _idUser }, {
                                    $pull: {
                                        "matches": { "_id": _idChatUser },
                                        "likes": { "_id": _idChatUser },
                                        "likedByUSers": _idChatUser,
                                    },
                                    $set: { dislikes: matchObj[_idChatUser] }
                                }, { new: true })];
                        case 2:
                            doc = _b.sent();
                            return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ '_id': _idChatUser }, {
                                    $pull: {
                                        "matches": { "_id": _idUser },
                                        "likes": { "_id": _idUser },
                                        "likedByUSers": _idUser,
                                    },
                                    $set: { dislikes: matchObj[_idUser] }
                                }, { new: true })];
                        case 3:
                            doc2 = _b.sent();
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, Messages_1.default.deleteMany({
                                    $or: [
                                        {
                                            $and: [
                                                {
                                                    receiver: _idUser,
                                                },
                                                {
                                                    sender: _idChatUser,
                                                },
                                            ],
                                        },
                                        {
                                            $and: [
                                                {
                                                    receiver: _idChatUser,
                                                },
                                                {
                                                    sender: _idUser,
                                                },
                                            ],
                                        },
                                    ],
                                })];
                        case 5:
                            allMessages = _b.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            e_1 = _b.sent();
                            console.log(e_1);
                            return [3 /*break*/, 7];
                        case 7:
                            //TODO: you can later test the doc output for total number of modifications should be 6 , 3 from each document
                            //once done removing (don;t show user the matched user again) =>  add to dislike user set
                            console.log("test docs in delete", doc);
                            _b.label = 8;
                        case 8: return [2 /*return*/, "done"];
                    }
                });
            });
        },
        deleteSquash: function (root, _a) {
            var _id = _a._id, image_set = _a.image_set;
            return __awaiter(void 0, void 0, void 0, function () {
                var squash;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("running");
                            return [4 /*yield*/, Squash_1.default.findById(_id)];
                        case 1:
                            squash = _b.sent();
                            if (squash && image_set) {
                                deleteAllUserImages(image_set).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, squash.remove().then(function () {
                                                    console.log("profile deleted and google cloud image deleted");
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [2 /*return*/, true];
                            }
                            else {
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        softDeleteUser: function (root, _a) {
            var _id = _a._id;
            return __awaiter(void 0, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Squash_1.default.findOneAndUpdate({ _id: _id }, { $set: { deleted: { isDeleted: true, deletedAt: new Date() } } }, { new: true })];
                        case 1:
                            doc = _b.sent();
                            console.log("user soft deleted");
                            return [2 /*return*/, "Done"];
                    }
                });
            });
        }
    },
};

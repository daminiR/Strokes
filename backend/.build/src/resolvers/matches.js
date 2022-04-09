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
    },
    Mutation: {
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
    }
};

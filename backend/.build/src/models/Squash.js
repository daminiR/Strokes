"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
var GENDERS = ["Male", "Female"];
var COUNTRY = ["US"];
var SPORTS = ["Squash", "Tennis", "Soccer", "badminton", "Hockey", "Volleyball", "Basketball", "Cricket", "Table Tennis", "Baseball", "Golf", "American Football"];
//const LEVELS = ["beginer", "intermediate", "expert"]
var LEVELS = ['0', '1', '2'];
var MAX_SPORTS_LIMIT = 5;
var imageArrayMaxLimit = function (val) {
    return (Array.isArray(val) && val.length <= 6);
};
var sportsArrayMaxLimit = function (val) {
    return (Array.isArray(val) && val.length <= MAX_SPORTS_LIMIT);
};
var imageArrayMinLimit = function (val) {
    return (Array.isArray(val) && val.length >= 1);
};
var _idValidator = function (_id) {
    return (_id === typeof (String));
};
// TODO: need to decide on what age requirement you need for your app -> 18 for now, also max requirement?
// TODO: need to figure away to allow enum values only once!
// TODO: need to check if age above 40s is really the persons age
var squashSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true,
        //validate: [
        //{
        //validator: _idValidator,
        //message: "_id provided is not an ObjectID",
        //},
        //],
    },
    first_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    last_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    visableLikePerDay: {
        type: Number,
        required: true,
        //TODO: fix the age and bithday category asap
        //validate: {
        //validator: Number.isInteger,
        //message: "{VALUE} is not an integer value",
        //},
    },
    sportChangesPerDay: {
        type: Number,
        required: true,
        //TODO: fix the age and bithday category asap
        //validate: {
        //validator: Number.isInteger,
        //message: "{VALUE} is not an integer value",
        //},
    },
    swipesPerDay: {
        type: Number,
        required: true,
        //TODO: fix the age and bithday category asap
        //validate: {
        //validator: Number.isInteger,
        //message: "{VALUE} is not an integer value",
        //},
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 90,
        //TODO: fix the age and bithday category asap
        //validate: {
        //validator: Number.isInteger,
        //message: "{VALUE} is not an integer value",
        //},
    },
    gender: {
        type: String,
        required: true,
        enum: GENDERS,
    },
    sports: {
        type: [
            {
                game_level: { type: String, enum: LEVELS },
                sport: { type: String, enum: SPORTS },
            },
        ],
        required: true,
        validate: [
            {
                validator: imageArrayMinLimit,
                message: "Cannot have no sport, choose atleast one",
            },
            {
                validator: sportsArrayMaxLimit,
                message: "Cannot have more than 5 chossen sports at a time",
            },
        ],
    },
    location: {
        type: {},
        required: true,
    },
    description: {
        type: String,
        maxlength: 300,
    },
    image_set: {
        type: [
            {
                img_idx: { type: Number },
                imageURL: { type: String },
                filePath: { type: String },
            }
        ],
        required: true,
        validate: [
            {
                validator: imageArrayMinLimit,
                message: "Cannot have no images",
            },
            {
                validator: imageArrayMaxLimit,
                message: "No more than 6 images",
            },
        ],
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    likes: {
        type: [String],
        //type:<PotentialMatchT>{},
        required: false,
    },
    likedByUSers: {
        type: {},
        required: false,
    },
    dislikes: {
        type: [String],
        required: false,
    },
    i_blocked: {
        type: {},
        required: false,
    },
    blocked_me: {
        type: {},
        required: false,
    },
    matches: {
        type: {},
        required: false,
    },
    // new additions
    deleted: {
        type: {},
        required: false,
    },
    active: {
        type: Boolean,
        required: false,
    },
    blockedByAdmin: {
        type: Boolean,
        required: false,
    },
}, { timestamps: true });
var Squash = (0, mongoose_1.model)('Squash', squashSchema);
exports.default = Squash;

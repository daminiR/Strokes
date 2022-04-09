"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongodb_1 = require("mongodb");
var messageSchema = new mongoose_1.Schema({
    _id: {
        type: mongodb_1.ObjectId,
        required: true
    },
    receiver: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        maxlength: 3000,
    },
    createdAt: {
        type: Date,
    },
});
var Message = (0, mongoose_1.model)('Messages', messageSchema);
exports.default = Message;

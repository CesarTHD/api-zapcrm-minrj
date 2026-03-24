"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const node_firebird_1 = __importDefault(require("node-firebird"));
const options = {
    host: "34.133.194.40",
    port: 3051,
    database: "C:\\sistemas\\c146\\CDB\\min.25.cdb",
    user: "GUEST",
    password: "qwe@123#456+789",
    lowercase_keys: false,
    role: null,
    pageSize: 4096,
};
function connectDB() {
    return new Promise((resolve, reject) => {
        node_firebird_1.default.attach(options, function (err, db) {
            if (err)
                reject(err);
            resolve(db);
        });
    });
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDirectory = path_1.default.resolve(__dirname, "../../logs");
const logFileName = path_1.default.resolve(logDirectory, "req.log");
console.log("Log Directory:", logDirectory);
console.log("Log File Name:", logFileName);
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory, { recursive: true });
    console.log("Log directory created");
}
const accessLogStream = fs_1.default.createWriteStream(logFileName, { flags: 'a' });
const morganMiddleware = (0, morgan_1.default)('combined', { stream: accessLogStream });
exports.default = morganMiddleware;

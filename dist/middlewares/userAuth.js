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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRepository_1 = require("../repositories/userRepository");
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET || 'myjwtsecret';
class AuthMiddleware {
    constructor(jwtSecret, userRepository) {
        this.verifyToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return res.status(401).send('Access Denied: No Token Provided!');
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
                const userData = yield this.userRepository.findUserByEmail(decoded.email);
                if ((userData === null || userData === void 0 ? void 0 : userData.is_verified) === false) {
                    return res.status(401).send('Access Denied: You Are Blocked By Admin!');
                }
                if (decoded) {
                    req.user = decoded;
                    next();
                }
                else {
                    return res.status(401).send('Access Denied: Invalid Token Or Expired Provided!');
                }
            }
            catch (error) {
                res.status(400).send('Invalid Token');
            }
        });
        this.checkRole = (roles) => {
            return (req, res, next) => {
                console.log('Data from middleware-->', req.user, roles);
                if (!req.user || !roles.includes(req.user.role)) {
                    return res.status(403).send('Access Denied: Insufficient Permissions!');
                }
                next();
            };
        };
        this.checkAuthorization = (requiredRoles = []) => {
            return (req, res, next) => {
                try {
                    const authHeader = req.headers['authorization'];
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                        return res.status(401).json({ message: 'Access Denied: Invalid Authorization Header!' });
                    }
                    const token = authHeader.split(' ')[1];
                    const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
                    if (!decoded || typeof decoded.role !== 'string') {
                        return res.status(400).json({ message: 'Access Denied: Invalid Token Payload!' });
                    }
                    if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
                        return res.status(403).json({ message: 'Access Denied: Insufficient Permissions!' });
                    }
                    req.user = decoded;
                    next();
                }
                catch (error) {
                    return res.status(401).json({ message: 'Access Denied: Invalid or Expired Token!' });
                }
            };
        };
        this.jwtSecret = jwtSecret;
        this.userRepository = userRepository;
    }
}
const userRepository = new userRepository_1.UserRepository();
const authMiddleware = new AuthMiddleware(jwtSecret, userRepository);
exports.authMiddleware = authMiddleware;

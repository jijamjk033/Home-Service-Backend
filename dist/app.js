"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./config/db"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const socket_1 = require("./helpers/socket");
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const morgan_1 = __importDefault(require("./middlewares/morgan"));
const PORT = process.env.PORT || 5000;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const corsOption = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOption));
app.use(morgan_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/employee', employeeRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/notification', notificationRoutes_1.default);
(0, db_1.default)();
const server = http_1.default.createServer(app);
(0, socket_1.setupSocket)(server);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

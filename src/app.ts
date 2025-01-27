import express  from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import connectDB from './config/db';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import employeeRoutes from './routes/employeeRoutes';
import { setupSocket } from './helpers/socket';
import chatRoutes from './routes/chatRoutes';
import notificationRoutes from './routes/notificationRoutes';
import morganMiddleware from './middlewares/morgan';
import { authMiddleware } from './middlewares/userAuth';

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOption = {
    origin: process.env.Frontend_URL,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(morganMiddleware);

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/notification',notificationRoutes);
connectDB();
const server = http.createServer(app);

setupSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
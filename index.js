const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/cors/corsConfig');
const http = require('http');
const socketIo = require('socket.io');
const socketManager = require('./config/socketManager/socketManager');
const connectDatabase = require('./config/connectDatabase/connectDatabase');
// routes
const routes = require('./routes');
// logger
const logger = require('./config/logger/logger');

dotenv.config();

const app = express();

// Tạo server HTTP từ Express app
const server = http.createServer(app);

// Khởi tạo Socket.io và liên kết với server HTTP
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Allow this origin
        // origin: "http://192.168.1.3:3000", // Allow this origin
        methods: ["GET", "POST"], // Allow GET and POST methods
        allowedHeaders: ["Content-Type"], //    Allow headers if needed
    }
});
app.set('io', io);
socketManager(io);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Kết nối MongoDB
connectDatabase(mongoose, process.env.MONGO_URI);

// API Routes
app.use('/api/users', routes.userRoutes);
app.use('/api/auth', routes.authRoutes);
app.use('/api/groups', routes.groupRoutes);
app.use('/api/messages', routes.messageRoutes);
app.use('/api/projects', routes.projectRoutes);
app.use('/api/permissions', routes.permissionRoutes);
app.use('/api/members', routes.membersRoutes);
app.use('/api/tasks', routes.taskRoutes);
app.use('/api/list', routes.listRoutes);
app.use('/api/notifications', routes.notificationRoutes);
app.use('/api/sprint', routes.sprintRoutes);

// Route khác
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.use((err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`);
    res.status(500).send('Internal Server Error');
});

// Khởi động server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});

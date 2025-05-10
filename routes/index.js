// routes/index.js

const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const groupRoutes = require('./groupRoutes');
const messageRoutes = require('./messageRoutes');
const projectRoutes = require('./projectRoutes');
const permissionRoutes = require('./permissionRoutes');
const membersRoutes = require('./membersRoutes');
const taskRoutes = require('./taskRoutes');
const listRoutes = require('./listRoutes');
const notificationRoutes = require('./notificationRoutes');
const sprintRoutes = require('./sprintRoutes');

module.exports = {
    userRoutes,
    authRoutes,
    groupRoutes,
    messageRoutes,
    projectRoutes,
    permissionRoutes,
    membersRoutes,
    taskRoutes,
    listRoutes,
    notificationRoutes,
    sprintRoutes
};
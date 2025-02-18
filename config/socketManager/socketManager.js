const { getProjectIds } = require('../../controllers/projectController'); // Điều chỉnh đường dẫn đúng

const socketManager = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinGroupChat', ({ group }) => {
            socket.join(group);
            console.log(`User joined group: ${group}`);
        });

        socket.on('sendMessage', ({ sender, group, message }) => {
            const newMessage = { sender, group, message, timestamp: new Date() };
            io.to(group).emit('sendMessage', newMessage);
        });

        socket.on('openConnect', async ({ userId }) => {
            try {
                const newGroup = await getProjectIds(userId); // Lấy danh sách group
                newGroup.forEach((group) => socket.join(group));
                console.log(`User ${userId} joined groups: ${newGroup}`);
            } catch (error) {
                console.error(`Error in openConnect: ${error.message}`);
            }
        });

        socket.on('sendNotification', ({ group, message }) => {
            const newMessage = { group, message };
            io.to(group).except(socket.id).emit('sendNotification', newMessage);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketManager;

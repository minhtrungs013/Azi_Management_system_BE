const { log } = require('winston');
const { getProjectIds } = require('../../controllers/projectController'); // Điều chỉnh đường dẫn đúng
const socketManager = (io) => {
    const users = {}; // { username: socketId }
    io.on('connection', (socket) => {
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

        socket.on('register', (username) => {
            users[username] = socket.id;
            console.log(`User registered: ${username} (${socket.id})`);
            console.log(users);

        });

        socket.on('callUser', ({ to, signalData, from, name }) => {
            const targetSocketId = users[to];

            console.log(`Call from ${from} to ${to}: ${targetSocketId}`);

            if (targetSocketId) {
                io.to(targetSocketId).emit('callIncoming', {
                    from: name,
                    name,
                    signal: signalData,
                });
                console.log(`User ${from} is calling ${to}`);
            }
        });

        socket.on('answerCall', ({ to, signal }) => {
            const targetSocketId = users[to];
            console.log(targetSocketId);

            if (targetSocketId) {
                io.to(targetSocketId).emit('callAccepted', {
                    signal,
                });
                console.log(`Call answered by ${socket.id} to ${to}`);
            }
        });

        socket.on('ice-candidate', ({ to, candidate }) => {
            let targetSocketId = users[to];

            if (targetSocketId) {
                io.to(targetSocketId).emit('ice-candidate', {
                    candidate,
                });
            }
        });
        socket.on('tesst', ({ to, candidate }) => {
            let targetSocketId = users[to];
            console.log(to);

            if (targetSocketId) {
                io.to(targetSocketId).emit('ice-candidate', {
                    candidate,
                });
            }
        });

        socket.on('endCall', ({ to }) => {
            const targetSocketId = users[to];
            if (targetSocketId) {
                io.to(targetSocketId).emit('callEnded');
            }
        });

        socket.on('groupCall', ({ groupId, from, signalData }) => {
            const members = io.sockets.adapter.rooms.get(groupId);

            if (!members) return;

            io.to(groupId).except(socket.id).emit('groupCallIncoming', {
                from,
                signal: signalData,
                socketId: socket.id,
            });

            console.log(`${from} is calling group ${groupId}`);
        });

        socket.on('groupAnswer', ({ toSocketId, signal }) => {
            io.to(toSocketId).emit('groupCallAccepted', {
                from: socket.id,
                signal,
            });

            console.log(`User ${socket.id} answered group call from ${toSocketId}`);
        });

        socket.on('groupIceCandidate', ({ groupId, candidate }) => {
            io.to(groupId).emit('groupIceCandidate', {
                from: socket.id,
                candidate,
            });
        });

        socket.on('endGroupCall', ({ group }) => {
            const room = io.sockets.adapter.rooms.get(group);
            if (!room) return;

            room.forEach((memberSocketId) => {
                if (memberSocketId !== socket.id) {
                    io.to(memberSocketId).emit('groupCallEnded', {
                        from: socket.id,
                    });
                }
            });

            console.log(`Group call ended in group ${group}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketManager;

const mongoose = require('mongoose');
const { Message } = require('../models/message.model');
const { MessageGroup } = require('../models/messageGroup.model');
const { User } = require('../models/user.model');

module.exports = function (io) {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId || false;

        if (!userId) {
            socket.emit('status', {
                type: 'connection-fail',
            });
            socket.disconnect(true);
            return;
        }

        socket.join('user-' + userId);

        socket.emit('status', {
            type: 'user-connected',
        });

        socket.on('CREATE_CHAT', async (newMessageObj) => {
            let groupName = newMessageObj.groupName || '----';
            let users = newMessageObj.users;
            console.log('start chat', newMessageObj);
            try {
                if (users) {
                    if (Array.isArray(users)) {
                        users.push(userId);
                    } else {
                        users = [users, userId];
                    }
                } else {
                    throw new Error('bad-input');
                }

                const usersObjId = users.map((oneUserId) =>
                    mongoose.Types.ObjectId(oneUserId)
                );

                const usersDB = await User.find({ _id: { $in: usersObjId } });

                if (usersObjId.length !== usersDB.length) {
                    throw new Error('Users listed are not in the database');
                }

                let messages = [];

                if (newMessageObj.message) {
                    const newMessage = await Message.create({
                        user: userId,
                        message: newMessageObj.message,
                    });

                    messages.push(newMessage);
                }

                const newMsgGroup = await MessageGroup.create({
                    name: groupName,
                    users: usersDB,
                    messages,
                });

                users.forEach((oneUserId) => {
                    if (oneUserId !== userId) {
                        io.to('user-' + oneUserId).emit('status', {
                            type: 'user-newmessage-notification',
                            data: { userId },
                        });
                    }
                });

                console.log('out', newMsgGroup);
            } catch (err) {
                socket.emit('status', {
                    type: 'user-newmessage-fail',
                });
                console.log(err);
            }
        });

        socket.on('JOIN_CHAT', async (groupId) => {
            let messageGroupDB;
            try {
                messageGroupDB = await MessageGroup.findById(
                    groupId,
                    '-messages'
                );

                const userIndex = messageGroupDB.users.findIndex(
                    (userObjectId) => userObjectId.toString() === userId
                );

                if (userIndex < 0) {
                    throw new Error('User does not exist in this chat group');
                }
            } catch (error) {
                socket.emit('status', {
                    type: 'user-join-fail',
                });
                return;
            }

            socket.join(groupId);
            socket.emit('status', {
                type: 'user-joined',
                data: { groupId },
            });
            io.to(groupId).emit('status', {
                type: 'chat-joined',
                data: { userId },
            });

            socket.on('message', async (usrMessageObj) => {
                try {
                    const newMsg = await Message.create({
                        user: userId,
                        message: usrMessageObj.message,
                    });
                    const updatedMsgGroup = await MessageGroup.findOneAndUpdate(
                        { _id: usrMessageObj.groupId },
                        { $push: { messages: newMsg._id } },
                        {
                            new: true,
                        }
                    );

                    io.to(usrMessageObj.groupId).emit(
                        'message',
                        usrMessageObj.message
                    );
                    console.log(messageGroupDB._id);
                } catch (error) {
                    socket.emit('status', {
                        type: 'user-message-fail',
                    });
                    console.log(error);
                }
            });

            socket.on('LEAVE_CHAT', (groupId) => {
                socket.leave(groupId);
                socket.emit('status', {
                    type: 'user-left',
                    data: { groupId },
                });
                io.to(groupId).emit('status', {
                    type: 'chat-left',
                    data: { userId },
                });
            });
        });
    });
};

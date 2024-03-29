const mongoose = require('mongoose');
const { Message } = require('../models/message.model');
const { MessageGroup } = require('../models/messageGroup.model');
const { User } = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports = function (io) {
    io.on('connection', async (socket) => {
        let userId;
        try {
            const decodedToken = jwt.verify(
                socket.handshake.query.token,
                process.env.SECRET_KEY_SUPPLYDROP
            );
            userId = decodedToken.id;
            socket.join('userId-' + userId);
        } catch (error) {
            socket.disconnect();
        }

        socket.on('CREATE_CHAT', async (newMessageObj) => {
            let groupName = newMessageObj.groupName || '----';
            let users = newMessageObj.users;
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

                let userData = [];
                const usersObjId = users.map((oneUserId) => {
                    let userDatum = { userId: oneUserId };

                    if (oneUserId === userId) {
                        userDatum.chatUnseen = false;
                        userDatum.messagesUnread = 0;
                    }
                    userData.push(userDatum);
                    return mongoose.Types.ObjectId(oneUserId);
                });
                const usersDB = await User.find({ _id: { $in: usersObjId } });
                let messages = [];

                if (usersObjId.length !== usersDB.length) {
                    throw new Error('Users listed are not in the database');
                }

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
                    userData,
                });

                users.forEach((oneUserId) => {
                    socket.to('userId-' + oneUserId).emit('status', {
                        type: 'chat-created',
                        data: { groupId: newMsgGroup._id },
                    });
                });

                socket.emit('status', {
                    type: 'chat-created',
                    data: { groupId: newMsgGroup._id },
                });
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

                if (userIndex >= 0) {
                    messageGroupDB.userData[userIndex].chatUnseen = false;
                    messageGroupDB.userData[userIndex].messagesUnread = 0;
                    await messageGroupDB.save();
                } else {
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

            socket.on('LEAVE_CHAT', (groupId) => {
                socket.leave(groupId);
                socket.emit('status', {
                    type: 'user-left',
                    data: { groupId },
                });
                socket.to(groupId).emit('status', {
                    type: 'chat-left',
                    data: { userId },
                });
            });
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

                await updatedMsgGroup.userData.forEach((userDatum) => {
                    const otherUserId = userDatum.userId.toString();
                    const otherUserRoom = io.sockets.adapter.rooms.get(
                        'userId-' + otherUserId
                    );

                    if (otherUserRoom && otherUserId !== userId) {
                        userDatum.messagesUnread++;
                        socket.to('userId-' + otherUserId).emit('status', {
                            type: 'message-received',
                            data: { groupId: usrMessageObj.groupId },
                        });
                    }
                });

                await updatedMsgGroup.save();

                io.to(usrMessageObj.groupId).emit('message', newMsg);
            } catch (error) {
                socket.emit('status', {
                    type: 'user-message-fail',
                });
                console.log(error);
            }
        });
    });
};

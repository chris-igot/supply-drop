const { MessageGroup } = require('../models/messageGroup.model');

async function getMessageGroups(req, res) {
    const userToken = res.locals.payload;

    try {
        if (!userToken) {
            throw new Error('bad-input');
        }

        const result = await MessageGroup.find(
            { users: userToken.id },
            '-messages'
        ).populate('users', '-password');

        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

async function getGroupMessages(req, res) {
    const userToken = res.locals.payload;
    const groupId = req.params.groupId;

    try {
        if (!userToken || !groupId) {
            throw new Error('bad-input');
        }

        let query = { _id: groupId };

        const result = await MessageGroup.find(query)
            .populate('messages')
            .populate('users', '-password');

        if (
            result.length > 0 &&
            result[0].users.findIndex((user) => {
                return user._id.toString() === userToken.id;
            }) >= 0
        ) {
            res.json(result);
        } else {
            res.json([]);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

async function createNewGroup(req, res) {
    const userToken = res.locals.payload;
    let groupName = req.body.groupName;
    let users = req.body.users;
    try {
        if (userToken && users) {
            if (Array.isArray(users)) {
                users.push(userToken.id);
            } else {
                users = [users, userToken.id];
            }
        } else {
            throw new Error('bad-input');
        }

        if (!groupName) {
            groupName = '----';
        }

        // await User.updateMany({})

        const newMsgGroup = await MessageGroup.create({
            name: groupName,
            users,
            messages: [],
        });
        res.send(newMsgGroup);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

module.exports = {
    getMessageGroups,
    getGroupMessages,
    createNewGroup,
};

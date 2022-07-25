const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let MessageGroupSchema = new Schema(
    {
        name: {
            type: String,
        },

        users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],

        messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],

        userData: [
            {
                userId: { type: mongoose.Types.ObjectId, ref: 'User' },
                chatUnseen: { type: Boolean, default: true },
                messagesUnread: { type: Number, default: 1 },
            },
        ],
    },
    { timestamps: true }
);

MessageGroupSchema.post('save', function (next) {});

module.exports.MessageGroup = mongoose.model(
    'MessageGroup',
    MessageGroupSchema
);

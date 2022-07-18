const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let MessageSchema = new Schema(
    {
        message: {
            type: String,
            required: [true, 'Message is required'],
            minlength: [1, 'Message must be longer then 1 character'],
        },

        user: { type: mongoose.Types.ObjectId, ref: 'User' },
        messageGroup: { type: mongoose.Types.ObjectId, ref: 'MessageGroup' },
    },
    { timestamps: true }
);

MessageSchema.post('save', function (next) {});

module.exports.Message = mongoose.model('Message', MessageSchema);

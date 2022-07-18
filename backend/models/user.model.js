const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
let UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            minlength: [2, 'First name must be longer then 1 character'],
        },

        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            minlength: [2, 'Last name must be longer then 1 character'],
        },

        username: {
            type: String,
            required: [true, 'You must have a username'],
            minlength: [2, 'Username must be 2 characters or longer'],
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
        },

        messageGroups: [{ type: mongoose.Types.ObjectId, ref: 'MessageGroup' }],
    },
    { timestamps: true }
);

UserSchema.pre('save', function (next) {
    this.email = this.email.toLowerCase();
    bcrypt.hash(this.password, 10).then((hash) => {
        this.password = hash;
        next();
    });
});

module.exports.User = mongoose.model('User', UserSchema);

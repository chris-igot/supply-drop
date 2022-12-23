const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../models/user.model');

mongoose.set('strictQuery', true);
mongoose.set('autoIndex', true);

mongoose
    .connect('mongodb://localhost:27017/Supply_Drop_db?authSource=admin', {
        user: process.env.MONGODB_USER,
        pass: process.env.MONGODB_PW,
    })
    .then(() => {
        User.findOne({ username: 'admin' })
            .then(async (user) => {
                if (!user) {
                    console.log('No admin account. Creating...');
                    const newAdmin = {
                        firstName: 'admin',
                        lastName: 'admin',
                        username: 'admin',
                        email: process.env.ADMIN_DEFAULTEMAIL,
                        password: process.env.ADMIN_DEFAULTPW,
                        roles: ['administrator'],
                    };
                    User.create(newAdmin).then(() => {
                        console.log('Admin account created.');
                    });
                } else {
                    if (
                        bcrypt.compareSync(
                            process.env.ADMIN_DEFAULTPW,
                            user.password
                        )
                    ) {
                        console.log(
                            'WARNING: Admin default password in use. Please change admin password!'
                        );
                    }
                }
            })
            .catch((err) => console.log(err));
        console.log('Established a connection to the database');
    })
    .catch((err) =>
        console.log('Somthing went wrong when connecting to the database', err)
    );

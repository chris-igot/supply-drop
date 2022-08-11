const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../models/user.model');

mongoose
    .connect('mongodb://127.0.0.1:27017/Supply_Drop_db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    })
    .then(() => {
        User.findOne({ username: 'admin' })
            .then(async (user) => {
                const defaultPW = 'Password1!';

                if (!user) {
                    console.log('No admin account. Creating...');
                    const newAdmin = {
                        firstName: 'admin',
                        lastName: 'admin',
                        username: 'admin',
                        email: 'admin@a.com',
                        password: defaultPW,
                        roles: ['administrator'],
                    };
                    User.create(newAdmin).then(() => {
                        console.log('Admin account created.');
                    });
                } else {
                    if (bcrypt.compareSync(defaultPW, user.password)) {
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

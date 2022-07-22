require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.PUBLIC_URL_SUPPLYDROP,
        methods: ['GET', 'POST'],
    },
});
// const io = new Server(server);
const jwt = require('jsonwebtoken');

require('./configs/mongoose.configs');
app.use(cors({ credentials: true, origin: process.env.PUBLIC_URL_SUPPLYDROP }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/img/', express.static(__dirname + '/uploads'));
require('./routes/supply_drop.routes')(app);
require('./routes/socketChat')(io);

const port = process.env.PORT_SUPPLYDROP;

// app.listen(port, () => console.log(`Listening on port: ${port}`));
server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

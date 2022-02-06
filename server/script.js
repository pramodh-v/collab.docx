const mongoose = require('mongoose');
const doc = require('../models/doc');

const io = require('socket.io')(8080,{
    cors: {
        origin: 'http://localhost:3000',
        method: ['GET','POST'],
    }
});
io.on('connection', (socket) => {
    console.log('someone connected!');
});

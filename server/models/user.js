const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const User = new mongoose.Schema({
    _id: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

User.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, username: this.username, email: this.email }, process.env.JWT_SECRET);
    return token;
}

module.exports = mongoose.model('User', User);
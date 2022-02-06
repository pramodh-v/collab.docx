const mongoose = require('mongoose');

const Document = new mongoose.Schema({
    _id: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: Object
    },
    editors: [{
        type: Object
    }]
});
module.exports = mongoose.model('Document', Document);

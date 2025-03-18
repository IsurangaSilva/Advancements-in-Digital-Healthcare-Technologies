const mongoose = require('mongoose');
const connection = mongoose.connection.useDb('emotionDB');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    message: {
        type: String,
        required: true
    },
  
});
const contact = connection.model('contact', contactSchema);

module.exports = contact;

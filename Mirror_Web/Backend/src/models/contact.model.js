const mongoose = require('mongoose');
const connection = mongoose.connection.useDb('emotionDB');

const contactSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
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
const conact = connection.model('contact', predictionSchema);

module.exports = contact;

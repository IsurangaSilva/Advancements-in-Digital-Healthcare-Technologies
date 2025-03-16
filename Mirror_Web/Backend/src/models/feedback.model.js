const mongoose = require('mongoose');
const connection = mongoose.connection.useDb('emotionDB');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
   
    },
    feedback: {
        type: String,
        required: true
    },
  
});
const feedback = connection.model('feedback',feedbackSchema);

module.exports = feedback;

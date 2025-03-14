const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connection = mongoose.connection.useDb('emotionDB');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['patient', 'caregiver'],
      default: 'user'
    },
    phone: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = connection.model('users', userSchema);

module.exports = User;

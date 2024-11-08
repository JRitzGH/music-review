const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    userLower: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function (next) {
    this.LowerUser = this.username.toLowerCase();
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
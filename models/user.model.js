const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
},
{
    timestamps: true
})

const User = mongoose.model('User',userSchema)

module.exports = User
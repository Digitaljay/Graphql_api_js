const {Schema, model} = require('mongoose')

const schema = new Schema({
    _id: {
        type: Number,
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false,
        default: () => ""
    }
})

module.exports = model('User', schema)

const {Schema, model} = require('mongoose')

const schema = new Schema({
    _id: {
        type: Number,
    },
    authorId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    published: {
        type: String,
        default: () => Date.now().toString()
    }
})

module.exports = model('Post', schema)

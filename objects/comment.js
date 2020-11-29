const {Schema, model} = require('mongoose')


const schema = new Schema({
    _id: {
        type: Number,
        default: () => (Math.random() * 100).toFixed(0)
    },
    authorId: {
        type: Number,
        required: true
    },
    postId: {
        type: Number,
        required: true
    },
    replyTo: {
        type: Number,
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

module.exports = model('Comment', schema)

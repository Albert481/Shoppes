const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    postageTime: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Item', ItemSchema)
const mongoose = require('mongoose')

const ItemImageSchema = require('./ItemImage').schema;

const ItemSchema = new mongoose.Schema({
    id: {
        type: String
    },
    user: {
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
    itemSubCat: {
        type: String
    },
    type: {
        type: String
    },
    origin: {
        type: String
    },
    tags: {
        type: String
    },
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: String
    },
    postageTime: {
        type: String
    },
    images: [ItemImageSchema]
})

module.exports = mongoose.model('Item', ItemSchema)
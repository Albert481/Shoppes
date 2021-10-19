const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    id: {
        type: String
    },
    user: {
        type: String
    },
    title: {
        type: String
    },
    desc: {
        type: String
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
        type: String
    },
    quantity: {
        type: String
    },
    postageTime: {
        type: String
    },
    images: [{
        data: String,
        isCover: Boolean
    }]
})

module.exports = mongoose.model('Item', ItemSchema)
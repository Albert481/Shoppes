const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    id: {
        type: String
    },
    user: {
        type: String
    },
    createdAt: {
        type: String
    },
    main: {
        title: String,
        category: String,
        desc: String
    },
    stock: {
        price: String,
        quantity: String
    },
    delivery: {
        countryOfOrigin: String,
        processingTimeFrom: String,
        processingTimeTo: String,
        processingTimeMode: String
    },
    images: [{
        key: String,
        data: String,
        isCover: Boolean
    }]
})

module.exports = mongoose.model('Item', ItemSchema)
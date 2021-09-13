const mongoose = require('mongoose')

const ItemImageSchema = new mongoose.Schema({
    itemimgname: {
        type: String
    },
    iscoverimage: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('ItemImage', ItemImageSchema)
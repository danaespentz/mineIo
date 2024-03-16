const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    type: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    pilot: {
        required: true,
        type: Number
    },
    format: {
        required: true,
        type: String
    },
    connector_type: {
        required: true,
        type: String
    },
    connector_id: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Asset', assetSchema)
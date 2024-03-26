const mongoose = require('mongoose');
const assetSchema = new mongoose.Schema({
    model: {
        description: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        format: {
            type: String,
            required: true
        }
    },
    pilot: {
        type: String,
        required: true
    },
    connector: {
        name: {
            type: String,
            required: false
        },
        protocol: {
            type: String,
            required: false
        },
        parameters: [
            {
                name: {
                    type: String,
                    required: false
                },
                value: {
                    type: String,
                    required: false
                }
            }
        ]
    }
});

module.exports = mongoose.model('Asset', assetSchema);
const mongoose = require('mongoose');

// Define the connector schema
const connectorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    protocol: {
        type: String,
        required: true
    },
    parameters: [
        {
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    ]
});

// Export the connector schema
module.exports = mongoose.model('Connector', connectorSchema);
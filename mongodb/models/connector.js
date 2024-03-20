const mongoose = require('mongoose');

// Define the connector schema
const connectorSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    type_id: {
        type: Number,
        required: true
    }
});

// Export the connector schema
module.exports = mongoose.model('Connector', connectorSchema);

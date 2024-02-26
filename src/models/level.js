// Import necessary modules
const { Schema, model } = require('mongoose');

// New schema for level handling
const levelSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
})

// Export the module
module.exports = model('Level', levelSchema);
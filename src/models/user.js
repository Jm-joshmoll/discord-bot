// Import necessary modules
const { Schema, model } = require('mongoose');

// New schema for user handling
const userSchema = new Schema ({
    userId: {
        type: String, 
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    lastDaily: {
        type: Date,
        required: true,
    }
})

// Export the module
module.exports = model('User', userSchema);
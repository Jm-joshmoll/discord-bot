// Import necessary modules
const { Schema, model } = require('mongoose');

// New schema for level handling
const autoRoleSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    roleId: {
        type: String,
        required: true,
    },
})

// Export the module
module.exports = model('AutoRole', autoRoleSchema);
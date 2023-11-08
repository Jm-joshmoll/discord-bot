// Load environment variables
require('dotenv').config();

// Import necessary modules and classess from discord.js library
const { Client, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');

// Create a new Discord client instance with specific intents (permissions to perform certain actions)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent
    ],
});

// Invoke immediately and connect to db
(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected.");

        // Run the event handler
        eventHandler(client);
    // Logs error
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();

// Log the bot into discord using the bot token
client.login(process.env.TOKEN);

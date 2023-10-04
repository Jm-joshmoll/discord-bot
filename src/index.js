// Load environment variables
require('dotenv').config();

// Import necessary modules and classess from discord.js library
const { Client, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

// Create a new Discord client instance with specific intents (permissions to perform certain actions)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent
    ],
});

// Run the event handler
eventHandler(client);

// Log the bot into discord using the bot token
client.login(process.env.TOKEN);

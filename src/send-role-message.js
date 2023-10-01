// Load environment variables
require('dotenv').config()

// Import necessary modules and classess from discord.js library
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits } = require('discord.js');

// Create a new Discord client instance with specific intents (permissions to perform certain actions)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent
    ]
});

// Create list of roles avaialable with their label and role id attached
const roles = [
    {
        id: '1157588429639524435',
        label: 'Red',
    },
    {
        id: '1157588496412852254',
        label: 'Green',
    },
    {
        id: '1157588534119637073',
        label: 'Blue',
    },
    {
        id: '1157588555741286440',
        label: 'Purple',
    },
    {
        id: '1157588590218453083',
        label: 'Pink',
    },
];

// When the bot is ready 
client.on('ready', async(c) => {
    // Try building the role buttons
    try {
        // Fetch the channel that we want the message to be using the channel id 
        const CHANNEL_ID = '1157589694817771570';
        const channel = await client.channels.cache.get(CHANNEL_ID);

        // If channel not found exit
        if (!channel) return;
        
        // Create the row below message for the buttons and build each button
        const row = new ActionRowBuilder();
        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            )
        })
        
        // Send message and row to channel
        await channel.send({
            content: 'Click buttons below to add or remove a role',
            components: [row]
        })
        // Exit
        process.exit();
    
    // Log any errors
    } catch (error) {
        console.log(error);
        
    }
});

// Login into bot using the bot TOKEN from .env
client.login(process.env.TOKEN);
// Load environment variables
require('dotenv').config()

// Import necessary modules and classess from discord.js library
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, Permissions, PermissionsBitField, GatewayIntentBits } = require('discord.js');

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

client.on('ready', async(c) => {
    try {
        const channel = await client.channels.cache.get('1157589694817771570');
        if (!channel) return;
        
        const row = new ActionRowBuilder();
    
        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            )
        })
    
        await channel.send({
            content: 'Claim or remove a role below',
            components: [row]
        })
        process.exit();
        
    } catch (error) {
        console.log(error);
        
    }
});

client.login(process.env.TOKEN);
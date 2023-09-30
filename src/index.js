// Load environment variables
require('dotenv').config()

// Import necessary modules and classess from discord.js library
const { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, Client, EmbedBuilder, Events, Permissions, PermissionsBitField, GatewayIntentBits, SlashCommandBuilder, ButtonStyle, ActivityType } = require('discord.js');

// Gets the current date and time
let currentDateTime = new Date();

// Create a new Discord client instance with specific intents (permissions to perform certain actions)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent
    ]
});

let status = [
    {
        name: 'lastest build: ' + currentDateTime.toLocaleString(),
        type: ActivityType.Streaming,
        url: 'https://www.youtube.com/watch?v=gbJRyal8fa0',    
    },
    {
        name: 'lastest build: ' + currentDateTime.toLocaleString(),
        type: ActivityType.Watching,
    },
    {
        name: 'lastest build: ' + currentDateTime.toLocaleString(),
        type: ActivityType.Listening,
        url: 'https://www.youtube.com/watch?v=gbJRyal8fa0',    
    },
    {
        name: 'lastest build: ' + currentDateTime.toLocaleString(),
        type: ActivityType.Playing,   
    },
];

// Event listener that triggers once the bot is ready after logging
client.once(Events.ClientReady, c => {

    // Logs that is ready to console
	console.log(`Ready! Logged in as ${c.user.tag} @ ` + currentDateTime.toLocaleString());

    // Set the bot's status
    setInterval(() => {
        let random = Math.floor(Math.random() * status.length)
        client.user.setActivity(status[random]);
    }, 15000);
});

// Event listener that triggers when an interaction (like slash commands) is created
client.on('interactionCreate', async(interaction) => {
    // Handles the buttons for role management
    try {
        if (interaction.isButton()) {
            await interaction.deferReply({ ephemeral:true });
        
            const role = interaction.guild.roles.cache.get(interaction.customId);
            if (!role) {
                interaction.editReply({
                content: "I couldn't find that role",
                })
                return;
            }
                
            const hasRole = interaction.member.roles.cache.has(role.id);
            if (hasRole) {
                await interaction.member.roles.remove(role);
                await interaction.editReply(`The role ${role} has been removed.`);
                return;
            }
        
            await interaction.member.roles.add(role);
            await interaction.editReply(`The role ${role} has been added.`);
        }

    } catch (error) {
        console.log(error);
    }

    // If it's not a chat input command, exit early
    if(!interaction.isChatInputCommand()) return;

    // Gets the username of the person who interacted with the bot  
    const user = interaction.user;

    // Handle the 'hey' command
    if (interaction.commandName === 'hey') {
        interaction.reply(`hey, ${user.displayName}!`);
        console.log(`${user.username} ran the hey command`); 
    }

    // Handle the 'hello' command
    if(interaction.commandName === 'hello') {
        const userOption = interaction.options.get('user')?.value;
        if(userOption) {
            interaction.reply(`Hello, ${userOption.toString()}!`);
        }
        else {
            interaction.reply('Hello World!');
        }
        console.log(`${user.username} ran the hello command`);
    }   

    // Handle the 'ping' command
    if (interaction.commandName === 'ping') {
        interaction.reply('Pong!');
        console.log(`${user.username} ran the ping command`);
    }

    // Handle the 'adder' command
    if(interaction.commandName === 'adder') {
        // For learning purpose one way we can get the number is like this
        const firstNumber = interaction.options.getNumber('first_number')
        // Another way is like this
        const secondNumber = interaction.options.get('second_number').value
        // Note that using ? such that interaction.options.get('second_number')?.value denotes optionality
        const result = firstNumber + secondNumber;
        interaction.reply(`The sum of ${firstNumber} and ${secondNumber} is ${result}!`);
        console.log(`${user.username} ran the adder command`);
    }    

    // Handle the 'bye' command
    if(interaction.commandName === 'bye') {
        const userOption = interaction.options.get('user')?.value;
        if(userOption) {
            interaction.reply(`Have a great day, ${userOption.toString()}!`);
        }
        else {
            interaction.reply('Have a great day!');
        }
        console.log(`${user.username} ran the bye command`);
    }
    
    // Handle the 'embed' command
    if(interaction.commandName === 'embed') {
        // Exampled embedder that links to discord.js documentation
        const exambleEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'Regular field title', value: 'Some value here' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        interaction.reply({ embeds: [exambleEmbed] })
    } 
});

// Event listener for messages 
client.on('messageCreate', message => {

    // Ignore messages from bots
    if (message.author.bot) return;  
    
    console.log(message.author.username + ': ' + message.content)
});

client.on('error', console.error);
client.on('warn', console.warn);

// Log the bot into discord using the bot token
client.login(process.env.TOKEN);

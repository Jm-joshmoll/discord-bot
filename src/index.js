// Load environment variables
require('dotenv').config()

// Import necessary modules and classess from discord.js library
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js');

// Retrieves bot token and server ID from environment varables
const token = process.env.DISCORD_BOT_TOKEN;
const server = process.env.SERVER_ID;

// Gets the current date and time
let currentDateTime = new Date();

// Create a new Discord client instance with specific intents (permissions to perform certain actions)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent]
});

// Log the bot into discord using the bot token
client.login(token);

// Event listener that triggers once the bot is ready after logging
client.once(Events.ClientReady, c => {

    // Logs that is ready to console
	console.log(`Ready! Logged in as ${c.user.tag} @ ` + currentDateTime.toLocaleString());

    // Set the bot's status
    client.user.setActivity('Just Joshing ya')

    // Defines slash commands using the SlashCommand Builder
    const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('This is a ping command! Replies with Pong!')

    const hello = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('This is a hello command! Replies with a greeting!')
    .addUserOption(option =>
        option
        .setName('user')
        .setDescription('The user to greet')
        .setRequired(false)
        )

    const bye = new SlashCommandBuilder()
    .setName('bye')
    .setDescription('This is a bye command! Wishes you well!')
    .addUserOption(option =>
        option
        .setName('user')
        .setDescription('The user to wish farewell')
        .setRequired(false)
        )

    const adder = new SlashCommandBuilder()
    .setName('adder')
    .setDescription('This command adds two numbers')
    .addNumberOption(option => 
        option
        .setName('first_number')
        .setDescription('Enter the first number to add')
        .setRequired(true)
        )
    .addNumberOption(option =>     
        option
        .setName('second_number')
        .setDescription('Enter the second number to add')
        .setRequired(true)
        )
    
    // Registers these slash commands for the specific server
    client.application.commands.create(ping, server)
    client.application.commands.create(hello, server)
    client.application.commands.create(bye, server)
    client.application.commands.create(adder, server)
});

// Event listener that triggers when an interaction (like slash commands) is created
client.on('interactionCreate', (interaction) => {

    // If it's not a chat input command, exit early
    if(!interaction.isChatInputCommand()) return

    // Handle the 'ping' command
    if(interaction.commandName === 'ping') {
        interaction.reply('Pong!');
    }

    // Handle the 'hello' command
    if(interaction.commandName === 'hello') {
        const userOption = interaction.options.getUser('user');
        if(userOption) {
            interaction.reply(`Hello, ${userOption.toString()}!`);
        }
        else {
            interaction.reply('Hello World!');
        }
    }

    // Handle the 'bye' command
    if(interaction.commandName === 'bye') {
        const userOption = interaction.options.getUser('user');
        if(userOption) {
            interaction.reply(`Have a great day, ${userOption.toString()}!`);
        }
        else {
            interaction.reply('Have a great day!');
        }
    }

    // Handle the 'adder' command
    if(interaction.commandName === 'adder') {
        const firstNumber = interaction.options.getNumber('first_number')
        const secondNumber = interaction.options.getNumber('second_number')

        if(isNaN(firstNumber) || isNaN(secondNumber)) {
            interaction.reply('Please enter a valid number!');
        }
        else {
            const result = firstNumber + secondNumber;
            interaction.reply(`The sum of ${firstNumber} and ${secondNumber} is ${result}!`);
        }
    }
})

// Event listener for messages (using the older 'prefix' method of creating commands) - purely for learning purposes
client.on('messageCreate', message => {

    // Ignore messages from bots
    if (message.author.bot) return;  
    
    // Handle the '!hello' command
    if (message.content === '!hello') {
        message.channel.send('Hello, world!');
    }
});

// Event listeners for logging errors and warnings
client.on('error', console.error);
client.on('warn', console.warn);



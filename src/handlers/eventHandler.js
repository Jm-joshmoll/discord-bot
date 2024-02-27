// Import the 'path' module to work with file and directory paths and utility function
const path = require('path');
const getAllFiles = require("../utils/getAllFiles");
const translate = require('@iamtraction/google-translate');

// Gets the current date and time
let currentDateTime = new Date();

module.exports = (client) => {

    // Fetch all folders in event folder
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    // Loop through each event folder to set up event listeners
    for (const eventFolder of eventFolders) {
        // Fetch and sort files inside folder
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b);

        // Regedit changing \\ to / and deduces each 'event' (like each slash command)
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

        // Set up event listener for the event
        client.on(eventName, async (arg) => {
            // Execute all event files' functions for this event
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(client, arg)
            }
        });
    }

    // Set up event listener for new messages to log them
    client.on('messageCreate', message => {

        // Ignore messages from bots
        if (message.author.bot) return;  
    
        console.log(currentDateTime.toLocaleString() + ': ' + message.author.username + ': ' + message.content)
    });
    
    // Set up event listener for message context menu commands
    client.on('interactionCreate', async (interaction) => {
        // If not message context menu command exit
        if (!interaction.isMessageContextMenuCommand()) return;

        // If interaction is translate message
        if (interaction.commandName === 'Translate message') {
            const targetMessage = interaction.targetMessage.content;

            // If there is no message let the user know
            if (!targetMessage) {
                return interaction.reply({
                  content: 'Please use this command on a message.',
                  ephemeral: true, // Make the response visible only to the user who used the command
                });
            }

            const targetLanguage = 'en'; // Change this to the language code you want

            try {
                // Translate the message 
                const translated = await translate(targetMessage, { to: targetLanguage });
                interaction.reply(`Orginal message: ${targetMessage}\nTranslated message: ${translated.text}`);
            // Log any erros
            } catch (error) {
                console.error('Translation Error:', error);
                interaction.reply({
                  content: 'An error occurred while translating the message.',
                  ephemeral: true,
                });                
            }
        }
    })

    // Set up event listener for user context menu commands
    client.on('interactionCreate', (interaction) => {
        // If not user context menu command exit
        if (!interaction.isUserContextMenuCommand()) return;

        if (interaction.commandName === 'User information') {
            // Fetches the target user information
            const targetUser = interaction.targetUser;

            // Displays the target user information
            interaction.reply(`Display Name: ${targetUser.globalName}\nUsername: ${targetUser.username}\nID: ${targetUser.id}\nTag: <@${targetUser.id}>`);
        }
    })

    // Log errors and warnings
    client.on('error', console.error);
    client.on('warn', console.warn);
};
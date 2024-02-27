// Load environment variables.
require('dotenv/config'); 

// Import necessary modules and classes from discord.js
const { ContextMenuCommandBuilder, ApplicationCommandType, REST, Routes } = require('discord.js');

// Create context menu commands data
const commandsData = [
    new ContextMenuCommandBuilder()
        .setName('User information')
        .setType(ApplicationCommandType.User),

    new ContextMenuCommandBuilder()
        .setName('Translate message')
        .setType(ApplicationCommandType.Message),
];

// Creates a new instance of the rest class
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    // Tries to register our context menu commands and lets the user know what its doing
    try {
        console.log('Refreshing context menu commands');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commandsData },
        )

        console.log('Sucessfully registered context menu commands');

    // Outputs if there is an error
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();
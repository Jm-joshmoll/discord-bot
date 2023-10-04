// This script is run when initalising / removing slash commands
// Load environment variables
require('dotenv').config();

// Import necessary modules and classess from discord.js library
const { REST, Routes } = require('discord.js');

// Command list to be registered
const commands = [
    // Removed commands since event handler has changed, empty will delete all commands, ready to remove this file
    // NOTE TO SELF logic can be improved as we delete all commands before re-adding commands
    // We could compare commands in command list to commands in server list and see if any have been edited, and edit them in the server, instead of adding or removing them
];

// Creating a new instance of the REST class, specifying the API version and setting the token from the environment variable
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Defining an asynchronous Immediately Invoked Function Expression (IIFE) to execute the code
(async () => {

    // Logging to the console that the removal of old slash commands is starting
    // Note this only deletes the current server / guilds commands (needs to be edited if you want to delete global commands)
    console.log('Deleting old commands....')

    try {
        // Create a current server command list
        const oldCommands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
        );

        // Delete all old slash commands in the server
        for (const oldCommand of oldCommands) {
            console.log(`Fetched command ${oldCommand.name}`)
            await rest.delete(
                Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, oldCommand.id)
            );
            console.log(`Deleted command ${oldCommand.name}`)
        }
        
        // Logging to the console that the removal was successful
        console.log('Successfully deleted all commands.');

    } catch (error) {
        // Logging to the console that there was an error
        console.error(error);
    }

    // Logging to the console that the registration of slash commands is starting
    console.log('Registering slash commands....')

    try {
        // Making a PUT request to the Discord API to register the slash commands for a specific application and guild
        // The IDs for the application and guild are obtained from environment variables
        // The `commands` variable is assumed to contain the command definitions
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        // Logging to the console that the registration was successful if the PUT request completes without throwing an error
        console.log('Successful registration!')    

    } catch (error) {
        // Logging to the console that there was an error if the PUT request throws an error
        console.log(`There was an error: ${error}`);
    }

})(); // Immediately invoking the function expression
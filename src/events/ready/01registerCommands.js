// Importing necessary configurations and functions
const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

// Export command registry module
// Registers commands to servers, in this case to the test server only
module.exports = async (client) => {  

    // Attempts to register / edit / delete commands
    try {

        // Fetch local commands and existing application commands
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);

        // Loop through each local command
        for (const localCommand of localCommands) {

            // Get command details
            const {name, description, options } =  localCommand;
            
            // Check if this local command already exists among the registered application commands
            const existingCommand = await applicationCommands.cache.find( (cmd) => cmd.name === name );

            // If the command already exists in the application's commands
            if (existingCommand) {

                // If the local command is marked for deletion
                if (localCommand.deleted) {
                    // Delete the existing command from the application's commands and log to console
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Deleted command: "${name}".`);
                    continue; // Skip the rest of this iteration
                }
                
                 // If the existing command differs from the local command definition
                if (areCommandsDifferent(existingCommand, localCommand)) {
                    // Edit the existing command to match the local command definition and log to console
                    await applicationCommands.edit(existingCommand.id, { description, options });
                    console.log(`Edited command: "${name}".`);
                }

            // Otherwise the command doesn't exist among the application's commands
            } else {

                // If the local command is marked for deletion, skip registration
                if (localCommand.deleted) {
                    console.log(` Skipping registering command "${name}" as it is set to delete.`);
                    continue;
                }

                // Register the new command from the local command definition and log to console
                await applicationCommands.create({ name, description, options });
                console.log(`Registered command: "${name}".`);
            }
        }
    
    // Logs an errors to console
    } catch (error) {
        console.log(`There was an error in 01registerCommands.js: ${error}`);
    }
};
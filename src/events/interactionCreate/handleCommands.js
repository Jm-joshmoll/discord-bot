// Importing necessary configurations and functions
const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require("../../utils/getLocalCommands");

// Export event handler module for interaction creation (e.g. when a command is invoked)
module.exports = async (client, interaction) => {

    // Ensure the interaction is a chat command
    if (!interaction.isChatInputCommand()) return;

    // Fetches local commands
    const localCommands = getLocalCommands();

    // Tries to run the command
    try {
         // Find the invoked command in the local commands list
        const commandObject = localCommands.find( (cmd) => cmd.name === interaction.commandName );
        
        // If command not found, exit
        if (!commandObject) return;

        // If command is developer-only ensure user is a developer
        if (commandObject.devOnly) {

            // If user is not a dev, and it is a requirement, output a reasonable reply and return
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: 'Only developers are allowed to run this command.',
                    ephemeral: true,
                });
                return;   
            }
        }

        // If command is for testing-only ensures command is only excutable in a test server
        if (commandObject.testOnly) {

            // If not in a test server, and it is a requirement, output a reasonable reply and return
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: 'This command cannot be ran here.',
                    ephemeral: true,
                });
                return; 
            }
              
        } 

        // Checks if user has permissions to run the command
        if (commandObject.permissionRequired?.length) {
            for (const permission of commandObject.permissionRequired) {

                // If user doesn't have permision output a reasonable reply and return
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: 'Not enough permissions',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        // Checks if bot has permissions to run the command
        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;
                
                // If bot doesn't have permision output a reasonable reply and return
                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        // Executes the command 
        await commandObject.callback(client, interaction);
    
    // Throws an error if there is a problem and logs this to console
    } catch (error) {
        console.log(`There was an error in handleCommands.js running this command: ${error}`);
    }
};
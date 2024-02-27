// Import necessary modules and classess from discord.js library
const { PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/autoRole');

// Export "autorole-disable" command module
module.exports = {
    // Command name and description
    name: 'autorole-disable',
    description: 'Disable your auto-role for this server!',

    // Permissions required for a user/bot to execute this command
    permissionsRequired : [PermissionFlagsBits.Administrator],

    // Callback function to execute when the command is invoked
    callback: async (client, interaction) => {
        // Checks if the command was made from inside a server
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        try {
            await interaction.deferReply();

            // Queries if the database has data for the server
            if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
                // If not then output message
                interaction.editReply("Auto role has not been configured for this server. Use `/autorole-configure` to set it up.");
                return;
            }
            
            // Delete data for the server
            await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
            interaction.editReply("Auto role has been disabled for this server. Use `/autorole-configure` to set it up again.");

        // Logs errors
        } catch (error) {
            await interaction.editReply(`There was an error when disabling autorole.`);
            console.log(`There was an error in autorole-disable.js when disabling autorole.: ${error}`);
        }
    }
}
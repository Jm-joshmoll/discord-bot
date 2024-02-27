// Import necessary modules and classess from discord.js library
const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const AutoRole = require ('../../models/autoRole');

// Export "autorole-configure" command module 
module.exports = {
    // Command name and description
    name: 'autorole-configure',
    description: 'Configure your auto-role for this server!',

    // Determines any options given to the user
    options: [
        {
            name: 'role',
            description: "The role you want users to get on join.",
            type: ApplicationCommandOptionType.Role,
            required: true,
        }
    ],

    // Permissions required for a user/bot to execute this command
    permissionsRequired : [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],

    // Callback function to execute when the command is invoked
    callback: async (client, interaction) => {
        // Checks if the command was made from inside a server
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        // Gets the role id from the options value provided
        const targetRoleId = interaction.options.get('role').value;

        try {
            await interaction.deferReply();

            // Queries the database to find data for the server
            let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });
            
            // If autoRole exists already
            if (autoRole) {
                // Check to see if the role has already been configured
                if (autoRole.roleId === targetRoleId) {
                    interaction.editReply("Auto role has already been configured for that role. To disable run `/autorole-disable`");
                    return;
                }
                
                // Make the new role the auto-role
                autoRole.roleId = targetRoleId;
            
            // If no data in database
            } else {
                // Create the data
                autoRole = new AutoRole({
                    guildId: interaction.guild.id,
                    roleId: targetRoleId,
                })
            }

            await autoRole.save();
            interaction.editReply("Autorole has now been configured. To disable run `/autorole-disable`");

        // Logs errors
        } catch (error) {
            await interaction.editReply(`There was an error when configuring autorole.`);
            console.log(`There was an error in autorole-configure.js when configuring autorole.: ${error}`);
        }
    }
}
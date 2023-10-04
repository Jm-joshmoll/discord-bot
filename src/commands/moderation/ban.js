// Import necessary modules and classess from discord.js library
const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

// Export "ban" command module
module.exports = {
    // Command name and description
    name: 'ban',
    description: 'Bans a member from the server.',

    // Indicates that the command is only available to developers
    devOnly : true,

    // Command options which specify the target user and reason for ban
    options: [
        {
            // Option name and description
            name: 'target-user',
            description: 'The user you want to ban.',

            // Indicates that the option is a requirement of the slash command
            required: true,

            // Option has to be of type mentionable ("@user")
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            // Option name and description
            name: 'reason',
            description: 'The reason for banning.',

            // Option has to be of type mentionable ("@user")
            type: ApplicationCommandOptionType.String,
        },
    ],
    // Permissions required for a user/bot to execute this command
    permissionsRequired : [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    // Callback function to execute when the command is invoked
    callback: (client, interaction) => {
        // Placeholder response (actual ban logic to be implemented)
        interaction.reply('ban..');
    },
}
// Import necessary modules and classess from discord.js library
const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

// Export "ban" command module
module.exports = {
    // Command name and description
    name: 'ban',
    description: 'Bans a member from the server.',

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
            description: 'The reason you want to ban.',

            // Option has to be of type string
            type: ApplicationCommandOptionType.String,
        },
    ],
    // Permissions required for a user/bot to execute this command
    permissionsRequired : [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],

    // Callback function to execute when the command is invoked
    callback: async (client, interaction) => {

        // Placeholder reply (<application> is thinking... message) whilst the bot is executing the task
        await interaction.deferReply();

        // Get the options provided and fetches the target user
        const targetUserID = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";
        const targetUser = await interaction.guild.members.fetch(targetUserID);

        // If the target user does not exist, reply with the appropriate response
        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        // If the target user is the owner of the server, reply with the appropriate response
        if (targetUserID === interaction.guild.ownerId) {
            await interaction.editReply("You cannot ban the server owner.");
            return;
        }

        // Fetches the highest role of the targetUser the interactionUser and the bot
        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        // If the targetUser has a higher or equal rank to the interactionUser, reply with the appropriate response
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You cannot ban that user as they have the same/higher role than you.");
            return;
        }

        // If the targetUser has a higher or equal rank to the bot, reply with the appropriate response
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I cannot ban someone that is the same/higher role than me.");
            return;
        }

        // Bans the targetUser
        try {
            // Bans and let's the interactionUser know upon success
            await targetUser.ban({ reason });
            await interaction.editReply(`User: ${targetUser} was banned\nReason: ${reason}`);
        // Logs errors
        } catch (error) {
            await interaction.editReply(`There was an error when banning ${targetUser}.`);
            console.log(`There was an error in ban.js when banning: ${error}`);
        } 
    },
}
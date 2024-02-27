// Import necessary modules and classess from discord.js library
const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");

// Export "timeout" command module 
module.exports = {
    // Command name and description
    name: 'timeout', 
    description: 'Timeout a user.',

    // Command options which specify the target user and reason for timeout
    options: [
        {
            // Option name and description
            name: 'target-user',
            description: 'The user you want to timeout',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            // Option name and description
            name: 'duration',
            description: 'Timeout duration (eg. 10s, 30m, 1hour, 1 day..).',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            // Option name and description
            name: 'reason',
            description: 'The reason for the timeout.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    
    // Permissions for bot and user
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],

    // Callback function to execute when the command is invoked
    callback: async (client, interaction) => {

        // Get variables
        const mentionable = interaction.options.get('target-user').value;
        const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s, 5s, 5m
        // "?.value" represents optional chaining since reason may not have a value and if it does not then we give it the default "no reason provided value"
        const reason = interaction.options.get('reason')?.value || "No reason provided";

        // Placeholder reply (<application> is thinking... message) whilst the bot is executing the task
        await interaction.deferReply();

        // If the target user does not exist, reply with the appropriate response
        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            await interaction.editReply("That user does not exist in this server.");
            return;
        }

        // If the target user is a bot, reply with the appropriate response
        if (targetUser.user.bot) {
            await interaction.editReply("I cannot timeout a bot.");
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply("Please provide a valid timeout duration.");
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply("Timeout duration cannot be less than 5 seconds or more than 28 days.")
        }

        // Fetches the highest role of the targetUser the interactionUser and the bot
        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        // If the targetUser has a higher or equal rank to the interactionUser, reply with the appropriate response
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You cannot timeout that user as they have the same/higher role than you.");
            return;
        }

        // If the targetUser has a higher or equal rank to the bot, reply with the appropriate response
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I cannot timeout someone that is the same/higher role than me.");
            return;
        }

        // Timeout a user
        try {
            // Import pretty ms for human readable time form
            const { default: prettyMs } = await import('pretty-ms');

            // If the target user is already timed out, add to timeout
            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`${targetUser}'s tiemout has been updated to ${prettyMs(msDuration, { verbose: true })}. \nReason: ${reason}`);
                return;
            }

            // Timeout the user
            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true })}. \nReason: ${reason}`);
        // Logs errors
        } catch (error) {
            await interaction.editReply(`There was an error when timing out ${targetUser}.`);
            console.log(`There was an error in timeout.js when timing out: ${error}`);
        }
    },
}
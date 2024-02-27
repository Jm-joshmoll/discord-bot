// Import necessary modules and classess from discord.js library
const { Client, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/user');

// Export balance command module 
module.exports = {
    // Command name, description and options
    name: 'balance',
    description: "See yours/someone else's balance.",
    options: [
        {
            name: 'user',
            description: 'The user whose balance you want to get.',
            type: ApplicationCommandOptionType.User,
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * 
     */ // Enables vscode IntelliSense for these parameters

    // Callback function to execute when the command is invoked
    callback: async (client, interaction) => {
        // Checks to see if command was invoked inside a server
        if (!interaction.inGuild()) {
            interaction.reply({ 
                content: "You can only run this command inside a server.",
                ephemeral: true,
            });
            return;
        }

        // Placeholder reply (<application> is thinking... message) whilst the bot is executing the task
        await interaction.deferReply();

        // Fetches the relevant user information
        const targetUserId = interaction.options.get('user')?.value || interaction.member.id;
        
        // Finds the target users data in the database
        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

        // If the user does not exist let the user know
        if (!user) {
            interaction.editReply(`<@${targetUserId}> doesn't have a profile yet.`);
            return;
        }
        
        // Otherwise output the relevant balance
        interaction.editReply(
            targetUserId === interaction.member.id // Remember this checks if the target user is the same as the user who started the interaction
                ? `Your balance is **${user.balance}**` // Output if they are the same user
                : `<@${targetUserId}>'s balance is **${user.balance}**` // If they aren't, this is the output
        )
    },
};
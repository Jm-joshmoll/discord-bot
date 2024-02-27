// Import necessary modules and classess from discord.js library
const {  } = require('discord.js');
const User = require('../../models/user');

// Sets the daily balance to be given
const dailyAmount = 1000;

// Export daily command module 
module.exports = {
    // Command name and description
    name: 'daily',
    description: 'Collect your dailies!',

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
        
        try {
            await interaction.deferReply();
            
            // The data we want to query our database with
            let query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
            };

            // Finds the user from the database
            let user = await User.findOne(query);

            // If the user exists within the database
            if (user) {
                // Check to see if the user has already claimed their daily today
                const lastDailyDate = user.lastDaily.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyDate === currentDate) {
                    interaction.editReply("You have already collected today's daily. Come back tomorrow!");
                    return;
                }

            // Otherwise if the user does not exist within the database
            } else {
                // Create a new user
                user = new User({
                    ...query,
                    lastDaily: new Date(),
                });
            }

            // Updates the user balance
            user.balance += dailyAmount;
            await user.save();

            // Lets the user know their balance has been updated
            interaction.editReply(`${dailyAmount} was added to your balance. Your new balance is ${user.balance}!`);
        
        // If there was an error let the user know and output error to console
        } catch (error) {
            await interaction.editReply(`There was an error claiming daily.`);
            console.log(`Error with /daily: ${error}`);
        } 
    },
};
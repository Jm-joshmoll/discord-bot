// Import necessary modules and classess from discord.js library
const { ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const level = require("../../models/level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const { Font, RankCardBuilder } = require("canvacord");

// Loads the bundled "Geist" font
Font.loadDefault()

// Export "level" command module
module.exports = {
    // Command name and description
    name: 'level',
    description: "Shows your/someone's level.",

    // Command options which specify the target user to inspect level
    options: [
        {
            // Option name and description
            name: 'target-user',
            description: "The user whose level you want to see.",

            // Option has to be of type mentionable ("@user")
            type: ApplicationCommandOptionType.Mentionable,
        },
    ],

    // Callback function to execute when the command is invoked
    callback: async (client, interaction) => {
        // Check to see if command is run inside a server
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server");
            return;
        }

        // Placeholder reply (<application> is thinking... message) whilst the bot is executing the task
        await interaction.deferReply();

        // Fetches the relevant user information
        const mentionedUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        // Fetches the target users level
        const fetchedLevel = await level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        // If there is no level attached, let the user know
        if (!fetchedLevel) {
            interaction.editReply(
                mentionedUserId 
                ? `${targetUserObj} doesn't have any levels yet. Try again when they chat a little more` 
                : "You don't have any levels yet. Chat a little more and try again"
            );
            return;
        };

        // Fetch all user levels and sort them in xp order
        let allLevels = await level.find({guildId: interaction.guild.id}).select('-_id userId level xp');
        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        // Fetches the users current rank
        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

        // Sets the globalname if the user has not updated their name yet
        const displayName = targetUserObj.user.globalName 
            ? targetUserObj.user.globalName
            : targetUserObj.user.username; 

        // Sets the status if the user is offline (since this appears as Null)
        const status = targetUserObj.presence && targetUserObj.presence.status
            ? targetUserObj.presence.status
            : "offline";

        // Creates a canvacord Card
        const card = new RankCardBuilder()
            .setDisplayName(displayName)
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setLevel(fetchedLevel.level)
            .setRank(currentRank)
            .setStatus(status)
            .setBackground("https://media.discordapp.net/attachments/1157374421812641914/1211704931359399946/PIbVtMB.png?ex=65ef2b28&is=65dcb628&hm=a2a1afa86a9e507aa3477ca1ac1d8403b0b1d0adeeae6d5ab352a7b3f8867bb9&=&format=webp&quality=lossless&width=1609&height=905")
            .setOverlay(null)
        
        const image = await card.build({
            format: "png",
        });

        const attachment = new AttachmentBuilder(image);
        interaction.editReply({ files: [attachment] });
    },
}
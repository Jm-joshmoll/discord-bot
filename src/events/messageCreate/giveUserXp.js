// Import necessary modules
const { Client, Message } = require('discord.js');
const Level = require('../../models/level');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const cooldowns = new Set();

// Calculate a random amount of xp between min and max value
function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

// Export "giveUserXp" module
module.exports = async(client, message) => {
    // If the message is not from a server or the message is from a bot, don't do exit
    if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

    // Calculate xp
    const xpToGive = getRandomXp(5, 15);

    // Intialise a query
    const query = {
        userId: message.author.id,
        guildId: message.guild.id,
    };

    try {
        // Find the level of the user
        const level = await Level.findOne(query);

        // If level exists
        if (level) {
            // Give the user xp
            level.xp += xpToGive;

            // If the xp amount takes into the next level
            if (level.xp > calculateLevelXp(level.level)) {
                // Level up the user and send them a message
                level.xp = 0;
                level.level += 1;

                message.channel.send(`${message.member} you have leveled up to **${level.level}**.`); // TODO: Send in pre-defined channel
            }

            // Save the new level
            await level.save().catch((e) => {
                console.log(`Error saving updated level: ${e}`);
                return;
            })

            // Put user on 60s cooldown so they don't constantly recieve xp
            cooldowns.add(message.author.id);
            setTimeout(()=> {
                cooldowns.delete(message.author.id);
            }, 60000)

        } else {
            // Create new level
            const newLevel = new Level({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive,
            });

            // Save the new level
            await newLevel.save();

            // Put user on 60s cooldown so they don't constantly recieve xp
            cooldowns.add(message.author.id);
            setTimeout(()=> {
                cooldowns.delete(message.author.id);
            }, 60000)
        }
        
    // Catch and log any errors
    } catch (error) {
        console.log(`Error giving xp: ${error}`);
    }
}
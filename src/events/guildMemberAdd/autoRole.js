// Import necessary modules and classess from discord.js library
const { Client, GuildMember } = require('discord.js');
const AutoRole = require('../../models/autoRole');

// Import useful parameters
/** 
 * 
 * @param {Client} client
 * @param {GuildMember} member
 */

// Exports "autoRole" event listener
module.exports = async (client, member) => {
    try {
        // Gets the server where the member joined
        let guild = member.guild
        // If not in server exit
        if (!guild) return;
        
        // Checks if autorole is configured
        const autoRole = await AutoRole.findOne({ guildId: guild.id });
        // If not configured exit
        if (!autoRole) return;

        // Adds the role to the member
        await member.roles.add(autoRole.roleId);

    // Logs any errors
    } catch (error) {
        console.log(`Error giving role automatically. ${error}`);
    }
}
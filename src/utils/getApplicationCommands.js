// Exports "getApplicationCommands" module that fetches application commands
module.exports = async (client, guildID) => {
    
    // Initalise application commands
    let applicationCommands;

    // If a guildID is provided, fetch the commands specific to that guild
    if (guildID) {
        const guild = await client.guilds.fetch(guildID);
        applicationCommands = guild.commands;
    } else {
        // If no guildID is provided, fetch global application commands
        applicationCommands = await client.application.commands;
    }  

    // Fetch the actual command data from Discord's API
    await applicationCommands.fetch();

    // Return the application commands
    return applicationCommands;
};
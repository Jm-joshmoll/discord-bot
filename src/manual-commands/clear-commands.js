 // Load environment variables.
require('dotenv/config');

// Import necessary modules and classes from discord.js
const { REST, Routes } = require('discord.js'); 

// Create a REST instance. Make sure to set the token.
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Clear commands globally.
function clearGlobalCommands() {
  console.log('Clearing commands...');

  // Clear the commands.
  rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
    .then(() => console.log('Commands cleared.'))
    .catch(console.error); // Make sure to catch any errors.
}

// Clear commands for a specific guild.
function clearGuildCommands(guildId) {
  if (!guildId) throw new Error('You must provide a guild id.');

  console.log('Clearing commands...');

  // Clear the commands.
  rest
    .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: [] })
    .then(() => console.log(`Commands cleared for guild "${guildId}".`))
    .catch(console.error); // Make sure to catch any errors.
}

// Uncomment the next line to clear global commands.
//clearGlobalCommands();

// Uncomment the next line to clear commands for a guild.
//clearGuildCommands(process.env.GUILD_ID);
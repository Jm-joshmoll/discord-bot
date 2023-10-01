// Gets the current date and time
let currentDateTime = new Date();

// Export "console log" command module 
module.exports = (client) => {
    // Log to the console that the bot is online with its user tag and date/time
    console.log(currentDateTime.toLocaleString() + `: ${client.user.tag} is online.`);
};
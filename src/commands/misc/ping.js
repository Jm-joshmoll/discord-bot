// Export "ping" command module 
module.exports = {
    // Command name and description
    name: 'ping',
    description: 'Pong!',

    // Determines if command is only available for developers
    // devOnly : Boolean, 

    // Determines if command is only available for testing
    testOnly: true, 

    // Determines if it is to be deleted
    // deleted: Boolean, 

    // Determines any options given to the user
    // options, Object[],

    // Callback function to execute when the command is invoked
    callback: (client, interaction) => {
        // Replies back with message and the bot's latency in ms
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    },
};
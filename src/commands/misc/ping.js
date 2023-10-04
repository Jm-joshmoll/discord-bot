// Export "ping" command module 
module.exports = {
    // Command name and description
    name: 'ping',
    description: 'Pong!',

    // Callback function to execute when the command is invoked
    callback: async (client, interaction) => {
        
        // Placeholder reply (<application> is thinking... message) whilst the bot is executing the task
        await interaction.deferReply(); // deferReply({ ephemeral: true }) if you want the reply to be hidden to everyone else
        
        // Fetches interaction reply and compares the created timestamp of the reply to the initial interaction
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        // Replies back with message and the bot's latency in ms
        interaction.editReply(`Pong! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`);
    },
};

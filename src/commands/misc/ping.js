// Export "ping" command module 
module.exports = {
    // Command name and description
    name: 'ping',
    description: 'Pong!',

    // Callback function to execute when the command is invoked
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        // Replies back with message and the bot's latency in ms
        interaction.editReply(`Pong! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`);
    },
};
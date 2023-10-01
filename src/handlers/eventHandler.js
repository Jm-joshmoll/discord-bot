// Import the 'path' module to work with file and directory paths and utility function
const path = require('path');
const getAllFiles = require("../utils/getAllFiles");

// Gets the current date and time
let currentDateTime = new Date();

// Exports the main event handler module
module.exports = (client) => {

    // Fetch all folders in event folder
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    // Loop through each event folder to set up event listeners
    for (const eventFolder of eventFolders) {
        // Fetch and sort files inside folder
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b);

        // Regedit changing \\ to / and deduces each 'event' (like each slash command)
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

        // Set up event listener for the event
        client.on(eventName, async (arg) => {
            // Execute all event files' functions for this event
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(client, arg)
            }
        });
    }

    // Set up event listener for new messages to log them
    client.on('messageCreate', message => {

        // Ignore messages from bots
        if (message.author.bot) return;  
                
            console.log(currentDateTime.toLocaleString() + ': ' + message.author.username + ': ' + message.content)
        });

    // Log errors and warnings
    client.on('error', console.error);
    client.on('warn', console.warn);
};
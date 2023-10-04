// Import the 'path' module to work with file and directory paths
const path = require('path');
// Import the utility function to fetch all files from a directory
const getAllFiles = require("./getAllFiles");

// Exports the "getLocalCommands" module
module.exports = (exceptions = []) => {
    // Initialize an array to store the local command objects
    let localCommands = [];

    // Fetch all command categories (subdirectories within the 'commands' directory)
    const commandCategories = getAllFiles(path.join(__dirname, '..', 'commands'), true);
    
    // Iterate over each command category
    for (const commandCategory of commandCategories) {
        // Fetch all command files within the current command category
        const commandFiles = getAllFiles(commandCategory);

        // Iterate over each command file
        for (const commandFile of commandFiles) {
            // Import (require) the command object from the command file
            const commandObject = require(commandFile);

            // If the command's name is listed in the exceptions, skip it
            if (exceptions.includes(commandObject.name)){
                continue;
            }
        
        // Add the command object to the localCommands array
        localCommands.push(commandObject);
        }
    }

    // Return the array of local command objects
    return localCommands;
};
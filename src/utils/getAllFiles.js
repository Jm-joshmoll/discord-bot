// Import the 'fs' module for file system operations
const fs = require('fs');
// Import the 'path' module to work with file and directory paths
const path = require('path');

// Export "getAllFiles" module that fetches all files from given directories
module.exports = (directory, foldersOnly = false) => {
    // Initialize an array to store the paths of found files
    let fileNames = [];

    // Read all items (files and directories) from the given directory.
    // The 'withFileTypes' option ensures that the returned items have additional methods 
    // to identify their type (e.g., isFile(), isDirectory())
    const files = fs.readdirSync(directory, {withFileTypes: true });

    // Iterate over each item (file or directory) in the directory
    for (const file of files) {
        // Resolve the full path of the item
        const filePath = path.join(directory, file.name);

        // If the 'foldersOnly' flag is true, add only directories to the 'fileNames' array
        if (foldersOnly) {
            if (file.isDirectory()) {
                fileNames.push(filePath);
            } 
            
        // If the 'foldersOnly' flag is false, add only files to the 'fileNames' array
        } else {
            if (file.isFile()) {
                fileNames.push(filePath);
            }
        }
    }

    // Return the array containing paths to the found files or directories
    return fileNames;
};
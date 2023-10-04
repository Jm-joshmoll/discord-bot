// Export "commandName" command module 
module.exports = {
    // Command name and description
    name: 'name',
    description: 'description!',

    // Determines if command is only available for developers
    // devOnly : Boolean, 

    // Determines if command is only available for testing
    //testOnly: Boolean, 

    // Determines if it is to be deleted
    // deleted: Boolean, 

    // Determines any options given to the user
    // options, Object[],

    // Callback function to execute when the command is invoked
    callback: (client, interaction) => {
        // Command function
    },
};
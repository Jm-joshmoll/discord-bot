// Export "areCommandsDifferent" module that compares local commands to built application commands (commands on the server already)
module.exports = (existingCommand, localCommand) => {

    // Compares an choices from the existing command with the corresponding choices from the local command.
    const isChoiceDifferent = (existingChoice, localChoice) => {
        // Check if the 'name' or 'value' properties of the two choices are different
        // If they are, it implies the choices are different and the function returns true
        return existingChoice?.name !== localChoice.name || 
               existingChoice?.value !== localChoice.value;
    };

     // Compares the entire set of choices from the existing command with the set from the local command.
    const areChoicesDifferent = (existingChoices = [], localChoices = []) => {
        // The 'some' function checks if at least one element in the array satisfies the provided condition.
        // Here, it checks if there is at least one local choice that doesn't match its counterpart in the existing choices.
        return localChoices.some(localChoice => 
            isChoiceDifferent(existingChoices.find(choice => choice.name === localChoice.name), localChoice)
        );
    };

    // Compares the entire set of options from the existing command with the set from the local command.
    const areOptionsDifferent = (existingOptions = [], localOptions = []) => {
        // Similar to 'areChoicesDifferent', this uses 'some' to check if there's any option in 'localOptions' 
        // that doesn't have a corresponding match in 'existingOptions'.
        return localOptions.some(localOption => {
            // Find the corresponding option in 'existingOptions' based on the option name
            const existingOption = existingOptions.find(option => option.name === localOption.name);
            
            // Check various properties of the options to determine if they're different.
            // If any property is different, or if the choices within the options are different, the function returns true.
            return !existingOption ||
                   localOption.description !== existingOption.description ||
                   localOption.type !== existingOption.type ||
                   (localOption.required ?? false) !== existingOption.required ||
                   localOption.choices?.length !== existingOption.choices?.length ||
                   areChoicesDifferent(localOption.choices, existingOption.choices);
        });
    };

    // The main comparison logic for the exported function.
    // If the command descriptions are different, or if the number of options is different, or if any individual option is different,
    // the function returns true, indicating the commands are different.
    return existingCommand.description !== localCommand.description ||
           (existingCommand.options?.length ?? 0) !== (localCommand.options?.length ?? 0) ||
           areOptionsDifferent(existingCommand.options, localCommand.options);
};

require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'hey',
        description: 'Replies with hey!',
    },
    {
        name: 'ping',
        description: 'Pong!',
    },
    {
        name: 'hello',
        description: 'This is a hello command! Replies with a greeting!',
        options: [
            {
                name: 'user',
                description: 'The user to greet',
                type: ApplicationCommandOptionType.String,
                required: false
            },
        ],
    },
    {
        name: 'bye',
        description: 'This is a bye command! Wishes you well!',
        options: [
            {
                name: 'user',
                description: 'The user to wish farewell',
                type: ApplicationCommandOptionType.String,
                required: false
            },
        ],
    },
    {
        name: 'adder',
        description: 'This command adds two numbers',
        options: [
            {
                name: 'first_number',
                description: 'Enter the first number to add',
                type: ApplicationCommandOptionType.Number,
                required: true
            },
            {
                name: 'second_number',
                description: 'Enter the second number to add',
                type: ApplicationCommandOptionType.Number,
                required: true
            },
        ],
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {

    console.log('Registering slash commands....')

    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('Successful registration!')    

    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();

/*




    const adder = new SlashCommandBuilder()
    .setName('adder')
    .setDescription('This command adds two numbers')
    .addNumberOption(option => 
        option
        .setName('first_number')
        .setDescription('Enter the first number to add')
        .setRequired(true)
        )
    .addNumberOption(option =>     
        option
        .setName('second_number')
        .setDescription('Enter the second number to add')
        .setRequired(true)
        )
    
    // Registers these slash commands for the specific server
    client.application.commands.create(ping, server)
    client.application.commands.create(hello, server)
    client.application.commands.create(bye, server)
    client.application.commands.create(adder, server)
});
*/
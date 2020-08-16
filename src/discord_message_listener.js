const executeCommand = require('./helpers/execute_command');
const messages = require('./messages');
const parseCommand = require('./helpers/parse_command');

const discordMessageListener = ({ client, discordKey }) => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
    });
    client.on('message', (message) => {
        if (message.author.id === client.user.id) return;
        const parsedCommand = parseCommand(message);
        if (!parsedCommand) {
            message.channel.send(messages.UNKNOWN_COMMAND);
        }
        else{
            executeCommand(parsedCommand);
        }
    });
    client.login(discordKey);
};

module.exports = discordMessageListener;

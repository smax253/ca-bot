const parseCommand = require('./helpers/parse_command');
const executeCommand = require('./helpers/execute_command');
const messages = require('./messages.js');

const discordMessageListener = ({ client, discordKey }) => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
    });
    client.on('message', (message) => {
        const parsedMessage = parseCommand(message);
        if (!parsedMessage) {
            message.channel.send(messages.UNKNOWN_COMMAND);
        }
        else{
            executeCommand(parsedMessage);
        }
    });
    client.login(discordKey);
};

module.exports = discordMessageListener;

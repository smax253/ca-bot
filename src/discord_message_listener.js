const executeCommand = require('./helpers/execute_command');
const messages = require('./locale/messages');
const parseCommand = require('./helpers/parse_command');

const discordMessageListener = ({ queue, client, discordKey }) => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
    });
    client.on('message', (message) => {
        if (message.author.id === client.user.id) return;
        const parsedCommand = parseCommand(message);
        if (parsedCommand) {
            parsedCommand.getIsCommand()
                ? executeCommand({ discordCommand: parsedCommand, serverQueue: queue })
                : message.channel.send(messages.UNKNOWN_COMMAND);
        }
    });
    client.login(discordKey);
};

module.exports = discordMessageListener;

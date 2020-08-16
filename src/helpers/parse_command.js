const DiscordCommand = require('../entities/discord_command');
const parseCommand = (message) => {
    const content = message.content;
    const isCommand = content.startsWith('!');
    if (isCommand) {
        const split = content.split(' ');
        const command = split[0];
        const args = split.slice(1).join(' ');
        return new DiscordCommand({
            message, isCommand, command, args,
        });
    }
    return null;
};
module.exports = parseCommand;

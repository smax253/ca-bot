const DiscordCommand = require('../entities/discord_command');
const commands = require('../locale/commands');
const parseCommand = (message) => {
    const content = message.content;
    const isPossibleCommand = content.startsWith(commands.prefix);
    if (isPossibleCommand) {
        const split = content.split(' ');
        const command = commands.commands[split[0].substring(commands.prefix.length)];
        const isCommand = !!command;
        let args = split.slice(1).join(' ');
        args = args ? args : undefined;
        return new DiscordCommand({
            message, isCommand, command, args,
        });
    }
    return null;
};
module.exports = parseCommand;

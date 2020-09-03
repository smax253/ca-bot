const commands = require('../commands');

const executeCommand = ({ serverQueue, discordCommand, client }) => {
    const command = discordCommand.getCommand();
    commands[command]({ serverQueue, discordCommand, client });
};


module.exports = executeCommand;

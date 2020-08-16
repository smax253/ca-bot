const messages = require('../messages');

const executeCommand = ({
    serverQueue,
    discordCommand,
}) => {
    const command = discordCommand.getCommand();
    switch(command) {
    case '!init':
        serverQueue.initServer(discordCommand.getServer().id)
            ? discordCommand.sendMessage(messages.INITIALIZATION_SUCCESS)
            : discordCommand.sendMessage(messages.INITIALIZATION_ALREADY_EXISTS);
        break;
    }
};
module.exports = executeCommand;

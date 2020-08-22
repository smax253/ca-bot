const isAuthorized = require('./is_authorized');
const messages = require('../locale/messages');

const runAuthorizedCommand = ({
    serverQueue,
    discordCommand,
}, command) => {
    isAuthorized({ serverQueue, discordCommand })
        ? command()
        : discordCommand.sendMessage(messages.NOT_AUTHORIZED);
};

module.exports = runAuthorizedCommand;

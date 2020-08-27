const messages = require('../locale/messages');

const runGroupCommand = ({
    serverQueue, discordCommand,
}, command) => {
    serverQueue.isGroup(discordCommand.getServerId(), discordCommand.getParentId())
        ? command()
        : discordCommand.sendMessage(messages.OFFICE_HOURS_WRONG_CHANNEL);
};
module.exports = runGroupCommand;

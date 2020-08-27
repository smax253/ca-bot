const messages = require('../locale/messages');

const runCommandIfActive = ({ serverQueue, discordCommand }, command) => {
    serverQueue.isActive(discordCommand.getServerId(), discordCommand.getParentId())
        ? command()
        : discordCommand.sendMessage(messages.OFFICE_HOURS_NOT_ACTIVE);
};
module.exports = runCommandIfActive;

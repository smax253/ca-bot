const messages = require('../locale/messages');

const executeCommand = ({
    serverQueue,
    discordCommand,
}) => {
    const command = discordCommand.getCommand();
    switch(command) {
    case 'init':
        serverQueue.initServer(discordCommand.getServerId())
            ? discordCommand.sendMessage(messages.INITIALIZATION_SUCCESS)
            : discordCommand.sendMessage(messages.INITIALIZATION_ALREADY_EXISTS);
        break;
    case 'queue':
        serverQueue.queue(discordCommand.getServerId(), discordCommand.getAuthor())
            ? discordCommand.sendMessage(messages.QUEUE_SUCCESS)
            : discordCommand.sendMessage(messages.QUEUE_ALREADY_QUEUED);
        break;
    case 'dequeue':
        serverQueue.dequeue(discordCommand.getServerId())
            ? discordCommand.sendMessage(messages.DEQUEUE_SUCCESS)
            : discordCommand.sendMessage(messages.DEQUEUE_NOT_FOUND);
        break;
    case 'remove':
        serverQueue.remove(discordCommand.getServerId(), discordCommand.getAuthor())
            ? discordCommand.sendMessage(messages.REMOVE_SUCCESS)
            : discordCommand.sendMessage(messages.REMOVE_NOT_FOUND);
    }
};
module.exports = executeCommand;

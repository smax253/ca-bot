const messages = require('../locale/messages');
const isAuthorized = require('./is_authorized');

const executeCommand = ({
    serverQueue,
    discordCommand,
}) => {
    const command = discordCommand.getCommand();
    switch(command) {
    case 'init':
        isAuthorized({ serverQueue, discordCommand })
            ? serverQueue.initServer(discordCommand.getServerId())
                ? discordCommand.sendMessage(messages.INITIALIZATION_SUCCESS)
                : discordCommand.sendMessage(messages.INITIALIZATION_ALREADY_EXISTS)
            : discordCommand.sendMessage(messages.NOT_AUTHORIZED);
        break;
    case 'addadmin':
        isAuthorized({ serverQueue, discordCommand })
            ? serverQueue.addAdmin(discordCommand.getServerId(), discordCommand.getArgs())
                ? discordCommand.sendMessage(messages.ADMIN_ADDED)
                : discordCommand.sendMessage(messages.ADMIN_ALREADY_ADDED)
            : discordCommand.sendMessage(messages.NOT_AUTHORIZED);
        break;
    case 'removeadmin':
        isAuthorized({ serverQueue, discordCommand })
            ? serverQueue.removeAdmin(discordCommand.getServerId(), discordCommand.getArgs())
                ? discordCommand.sendMessage(messages.ADMIN_REMOVED)
                : discordCommand.sendMessage(messages.ADMIN_NOT_FOUND)
            : discordCommand.sendMessage(messages.NOT_AUTHORIZED);
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
        break;
    }
};
module.exports = executeCommand;

const messages = require('../locale/messages');
const runAuthorizedCommand = require('./run_authorized_command');

const executeCommand = ({
    serverQueue,
    discordCommand,
}) => {
    const command = discordCommand.getCommand();
    switch(command) {
    case 'init':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            serverQueue.initServer(discordCommand.getServerId())
                ? discordCommand.sendMessage(messages.INITIALIZATION_SUCCESS)
                : discordCommand.sendMessage(messages.INITIALIZATION_ALREADY_EXISTS);
        });
        break;
    case 'addadmin':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            serverQueue.addAdmin(discordCommand.getServerId(), discordCommand.getArgs())
                ? discordCommand.sendMessage(messages.ADMIN_ADDED)
                : discordCommand.sendMessage(messages.ADMIN_ALREADY_ADDED);
        });
        break;
    case 'removeadmin':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            serverQueue.removeAdmin(discordCommand.getServerId(), discordCommand.getArgs())
                ? discordCommand.sendMessage(messages.ADMIN_REMOVED)
                : discordCommand.sendMessage(messages.ADMIN_NOT_FOUND);
        });
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

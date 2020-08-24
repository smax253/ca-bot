const messages = require('../locale/messages');
const runAuthorizedCommand = require('./run_authorized_command');
const checkArgs = require('./check_args');
const showServer = require('./show_server');

const executeCommand = ({
    serverQueue,
    discordCommand,
    client,
}) => {
    const command = discordCommand.getCommand();
    switch(command) {
    case 'init':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            sendMessageWithBoolean({
                result: serverQueue.initServer(discordCommand.getServerId()),
                discordCommand,
                trueMessage: messages.INITIALIZATION_SUCCESS,
                falseMessage: messages.INITIALIZATION_ALREADY_EXISTS,
            });
        });
        break;
    case 'addadmin':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            sendMessageWithBoolean({
                result: serverQueue.addAdmin(discordCommand.getServerId(), discordCommand.getArgs()),
                discordCommand,
                trueMessage: messages.ADMIN_ADDED,
                falseMessage: messages.ADMIN_ALREADY_ADDED,
            });
        });
        break;
    case 'removeadmin':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            sendMessageWithBoolean({
                result: serverQueue.removeAdmin(discordCommand.getServerId(), discordCommand.getArgs()),
                discordCommand,
                trueMessage: messages.ADMIN_REMOVED,
                falseMessage: messages.ADMIN_NOT_FOUND,
            });
        });
        break;
    case 'createroom':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            checkArgs(discordCommand)
                ? serverQueue.createRoom(discordCommand.getServerId(), discordCommand.getArgs(), discordCommand.getChannelManager(), client.user)
                    .then(result => {
                        sendMessageWithBoolean({
                            result,
                            discordCommand,
                            trueMessage: messages.ROOM_CREATED,
                            falseMessage: messages.ROOM_NOT_CREATED,
                        });
                    }).catch((error) => {
                        console.error('UNKNOWN ERROR: '.concat(error));
                        discordCommand.sendMessage('Unknown error occurred.');
                    })
                : discordCommand.sendMessage(messages.MISSING_ARGS);
        });
        break;
    case 'start':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            if (serverQueue.isGroup(discordCommand.getServerId(), discordCommand.getParentId())) {
                if (serverQueue.initQueue(discordCommand.getServerId(), discordCommand.getParentId())) {
                    showServer({ parentCategoryServer: discordCommand.getParent() });
                    discordCommand.sendMessage(messages.OFFICE_HOURS_STARTED);
                }
                else {
                    discordCommand.sendMessage(messages.OFFICE_HOURS_ALREADY_STARTED);
                }
            }
            else{
                discordCommand.sendMessage(messages.OFFICE_HOURS_WRONG_CHANNEL);
            }

        });
        break;
    case 'queue':
        sendMessageWithBoolean({
            result: serverQueue.queue(discordCommand.getServerId(), discordCommand.getAuthor()),
            discordCommand,
            trueMessage: messages.QUEUE_SUCCESS,
            falseMessage: messages.QUEUE_ALREADY_QUEUED,
        });
        break;
    case 'dequeue':
        sendMessageWithBoolean({
            result: serverQueue.dequeue(discordCommand.getServerId()),
            discordCommand,
            trueMessage: messages.DEQUEUE_SUCCESS,
            falseMessage: messages.DEQUEUE_EMPTY,
        });
        break;
    case 'remove':
        sendMessageWithBoolean({
            result: serverQueue.remove(discordCommand.getServerId(), discordCommand.getAuthor()),
            discordCommand,
            trueMessage: messages.REMOVE_SUCCESS,
            falseMessage: messages.REMOVE_NOT_FOUND,
        });
        break;
    }
};

const sendMessageWithBoolean = ({
    result, discordCommand, trueMessage, falseMessage,
}) => {
    result
        ? discordCommand.sendMessage(trueMessage)
        : discordCommand.sendMessage(falseMessage);
};

module.exports = executeCommand;

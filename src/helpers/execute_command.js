const messages = require('../locale/messages');
const runAuthorizedCommand = require('./run_authorized_command');
const checkArgs = require('./check_args');
const showServer = require('./show_server');
const runGroupCommand = require('./run_group_command');
const runCommandIfActive = require('./run_command_if_active');
const hideServer = require('./hide_server');
const handlePromiseWithMessage = require('./handle_promise_with_message');
const generateHelpCommand = require('./generate_help_command');

const executeCommand = ({ serverQueue, discordCommand, client }) => {
    const command = discordCommand.getCommand();
    switch (command) {
    case 'init':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            sendMessageWithBoolean({
                result: serverQueue.initServer(
                    discordCommand.getServerId(),
                ),
                discordCommand,
                trueMessage: messages.INITIALIZATION_SUCCESS,
                falseMessage: messages.INITIALIZATION_ALREADY_EXISTS,
            });
        });
        break;
    case 'addadmin':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            sendMessageWithBoolean({
                result: serverQueue.addAdmin(
                    discordCommand.getServerId(),
                    discordCommand.getArgs(),
                ),
                discordCommand,
                trueMessage: messages.ADMIN_ADDED,
                falseMessage: messages.ADMIN_ALREADY_ADDED,
            });
        });
        break;
    case 'removeadmin':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            sendMessageWithBoolean({
                result: serverQueue.removeAdmin(
                    discordCommand.getServerId(),
                    discordCommand.getArgs(),
                ),
                discordCommand,
                trueMessage: messages.ADMIN_REMOVED,
                falseMessage: messages.ADMIN_NOT_FOUND,
            });
        });
        break;
    case 'createroom':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            checkArgs(discordCommand)
                ? serverQueue
                    .createRoom(
                        discordCommand.getServerId(),
                        discordCommand.getArgs(),
                        discordCommand.getChannelManager(),
                        client.user,
                    )
                    .then((result) => {
                        sendMessageWithBoolean({
                            result,
                            discordCommand,
                            trueMessage: messages.ROOM_CREATED,
                            falseMessage: messages.ROOM_NOT_CREATED,
                        });
                    })
                    .catch((error) => {
                        console.error('UNKNOWN ERROR: '.concat(error));
                        discordCommand.sendMessage(
                            'Unknown error occurred.',
                        );
                    })
                : discordCommand.sendMessage(messages.MISSING_ARGS);
        });
        break;
    case 'start':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            runGroupCommand({ serverQueue, discordCommand }, () => {
                if (
                    serverQueue.initQueue(
                        discordCommand.getServerId(),
                        discordCommand.getParentId(),
                    )
                ) {
                    handlePromiseWithMessage({
                        promise: showServer({
                            parentCategoryServer: discordCommand.getParent(),
                        }),
                        discordCommand,
                        successMessage: messages.OFFICE_HOURS_STARTED,
                        failureMessage: messages.UNKNOWN_ERROR,
                    });
                }
                else {
                    discordCommand.sendMessage(
                        messages.OFFICE_HOURS_ALREADY_STARTED,
                    );
                }
            });
        });
        break;
    case 'stop':
        runAuthorizedCommand({ serverQueue, discordCommand }, () => {
            runGroupCommand({ serverQueue, discordCommand }, () => {
                runCommandIfActive({ serverQueue, discordCommand }, () => {
                    const users = serverQueue.stopQueue(
                        discordCommand.getServerId(),
                        discordCommand.getParentId(),
                    );
                    if (users) {
                        handlePromiseWithMessage({
                            promise: hideServer({
                                parentCategoryServer: discordCommand.getParent(),
                            }),
                            discordCommand,
                            successMessage: messages.OFFICE_HOURS_STOPPED,
                            failureMessage: messages.UNKNOWN_ERROR,
                        });
                    }
                    else {
                        discordCommand.sendMessage(
                            messages.OFFICE_HOURS_NOT_ACTIVE,
                        );
                    }
                });
            });
        });
        break;
    case 'queue':
        runGroupCommand({ serverQueue, discordCommand }, () => {
            runCommandIfActive({ serverQueue, discordCommand }, () => {
                sendMessageWithBoolean({
                    result: serverQueue.queue(
                        discordCommand.getServerId(),
                        discordCommand.getParentId(),
                        discordCommand.getAuthor(),
                    ),
                    discordCommand,
                    trueMessage: messages.QUEUE_SUCCESS,
                    falseMessage: messages.QUEUE_ALREADY_QUEUED,
                });
            });
        });
        break;
    case 'dequeue':
        runGroupCommand({ serverQueue, discordCommand }, () => {
            runCommandIfActive({ serverQueue, discordCommand }, () => {
                sendMessageWithBoolean({
                    result: serverQueue.dequeue(
                        discordCommand.getServerId(),
                        discordCommand.getParentId(),
                    ),
                    discordCommand,
                    trueMessage: messages.DEQUEUE_SUCCESS,
                    falseMessage: messages.DEQUEUE_EMPTY,
                });
            });
        });
        break;
    case 'remove':
        runGroupCommand({ serverQueue, discordCommand }, () => {
            runCommandIfActive({ serverQueue, discordCommand }, () => {
                sendMessageWithBoolean({
                    result: serverQueue.remove(
                        discordCommand.getServerId(),
                        discordCommand.getAuthor(),
                    ),
                    discordCommand,
                    trueMessage: messages.REMOVE_SUCCESS,
                    falseMessage: messages.REMOVE_NOT_FOUND,
                });
            });
        });
        break;
    case 'help':
        discordCommand.sendMessage(generateHelpCommand());
        break;
    }
};

const sendMessageWithBoolean = ({
    result,
    discordCommand,
    trueMessage,
    falseMessage,
}) => {
    result
        ? discordCommand.sendMessage(trueMessage)
        : discordCommand.sendMessage(falseMessage);
};

module.exports = executeCommand;

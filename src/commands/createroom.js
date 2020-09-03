const runAuthorizedCommand = require('../helpers/run_authorized_command');
const checkArgs = require('../helpers/check_args');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const messages = require('../locale/messages');

const createroom = ({
    discordCommand, serverQueue, client,
}) => {
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
                    discordCommand.sendMessage(messages.UNKNOWN_ERROR);
                })
            : discordCommand.sendMessage(messages.MISSING_ARGS);
    });
};

module.exports = createroom;

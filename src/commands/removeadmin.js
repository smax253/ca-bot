const runAuthorizedCommand = require('../helpers/run_authorized_command');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const messages = require('../locale/messages');

const removeadmin = ({
    discordCommand, serverQueue,
}) => {
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
};

module.exports = removeadmin;

const runAuthorizedCommand = require('../helpers/run_authorized_command');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const messages = require('../locale/messages');

const addadmin = ({ discordCommand, serverQueue }) => {
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
};

module.exports = addadmin;


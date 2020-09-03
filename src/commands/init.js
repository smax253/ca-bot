const runAuthorizedCommand = require('../helpers/run_authorized_command');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');

const messages = require('../locale/messages');

const init = ({
    serverQueue, discordCommand,
}) => {
    runAuthorizedCommand({ serverQueue, discordCommand }, () => {
        console.log('init server');
        const result = serverQueue.initServer(discordCommand.getServerId());
        sendMessageWithBoolean({
            result,
            discordCommand,
            trueMessage: messages.INITIALIZATION_SUCCESS,
            falseMessage: messages.INITIALIZATION_ALREADY_EXISTS,
        });
    });
};

module.exports = init;

const runGroupCommand = require('../helpers/run_group_command');
const runCommandIfActive = require('../helpers/run_command_if_active');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const parseMessage = require('../helpers/parse_message');
const messages = require('../locale/messages');

const queue = ({
    serverQueue,
    discordCommand,
}) => {
    const subs = {
        id: discordCommand.getAuthorId(),
    };
    runGroupCommand({ serverQueue, discordCommand }, () => {
        runCommandIfActive({ serverQueue, discordCommand }, () => {
            sendMessageWithBoolean({
                result: serverQueue.queue(
                    discordCommand.getServerId(),
                    discordCommand.getParentId(),
                    discordCommand.getAuthor(),
                ),
                discordCommand,
                trueMessage: parseMessage(messages.QUEUE_SUCCESS, subs),
                falseMessage: parseMessage(messages.QUEUE_ALREADY_QUEUED, subs),
            });
        });
    });
};

module.exports = queue;

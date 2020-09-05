const runGroupCommand = require('../helpers/run_group_command');
const runCommandIfActive = require('../helpers/run_command_if_active');
const parseQueue = require('../helpers/parse_queue');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const messages = require('../locale/messages');
const parseMessage = require('../helpers/parse_message');

const list = ({
    discordCommand,
    serverQueue,
}) => {
    runGroupCommand({ discordCommand, serverQueue }, () => {
        runCommandIfActive({ discordCommand, serverQueue }, () => {
            const queue = serverQueue.getQueue(discordCommand.getServerId(), discordCommand.getParentId());
            const subs = {
                queue: parseQueue(queue),
            };
            sendMessageWithBoolean({
                result: subs.queue,
                discordCommand,
                trueMessage: parseMessage(messages.QUEUE_LIST, subs),
                falseMessage: messages.QUEUE_EMPTY,
            });
        });
    });
};

module.exports = list;

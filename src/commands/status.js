const runGroupCommand = require('../helpers/run_group_command');
const runCommandIfActive = require('../helpers/run_command_if_active');
const getQueuePosition = require('../helpers/get_queue_position');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const parseMessage = require('../helpers/parse_message');
const messages = require('../locale/messages');

const status = ({ serverQueue, discordCommand }) => {
    runGroupCommand({ serverQueue, discordCommand }, () => {
        runCommandIfActive({ serverQueue, discordCommand }, () => {
            const queue = serverQueue.getQueue(discordCommand.getServerId(), discordCommand.getParentId());
            const position = getQueuePosition(queue, discordCommand.getAuthorId());
            const subs = {
                position,
                id: discordCommand.getAuthorId(),
            };
            sendMessageWithBoolean({
                result: position,
                discordCommand,
                trueMessage: parseMessage(messages.STATUS_SUCCESS, subs),
                falseMessage: parseMessage(messages.STATUS_NOT_FOUND, subs),
            });
        });
    });
};

module.exports = status;

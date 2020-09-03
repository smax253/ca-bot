const runGroupCommand = require('../helpers/run_group_command');
const runCommandIfActive = require('../helpers/run_command_if_active');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const parseMessage = require('../helpers/parse_message');
const messages = require('../locale/messages');
const runAuthorizedCommand = require('../helpers/run_authorized_command');

const dequeue = ({
    discordCommand,
    serverQueue,
}) => {
    runAuthorizedCommand({ serverQueue, discordCommand }, () => {
        runGroupCommand({ serverQueue, discordCommand }, () => {
            runCommandIfActive({ serverQueue, discordCommand }, () => {
                const subs = {
                    target: serverQueue.dequeue(discordCommand.getServerId(), discordCommand.getParentId()),
                };
                sendMessageWithBoolean({
                    result: subs.target,
                    discordCommand,
                    trueMessage: parseMessage(messages.DEQUEUE_SUCCESS, subs),
                    falseMessage: messages.DEQUEUE_EMPTY,
                });
            });
        });
    });

};

module.exports = dequeue;

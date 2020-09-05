const runGroupCommand = require('../helpers/run_group_command');
const runCommandIfActive = require('../helpers/run_command_if_active');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const parseMessage = require('../helpers/parse_message');
const messages = require('../locale/messages');

const remove = ({
    serverQueue,
    discordCommand,
}) => {
    const subs = {
        id: discordCommand.getAuthorId(),
    };
    runGroupCommand({ serverQueue, discordCommand }, () => {
        runCommandIfActive({ serverQueue, discordCommand }, () => {
            sendMessageWithBoolean({
                result: serverQueue.remove(
                    discordCommand.getServerId(),
                    discordCommand.getParentId(),
                    discordCommand.getMember(),
                ),
                discordCommand,
                trueMessage: parseMessage(messages.REMOVE_SUCCESS, subs),
                falseMessage: parseMessage(messages.REMOVE_NOT_FOUND, subs),
            });
        });
    });
};

module.exports = remove;

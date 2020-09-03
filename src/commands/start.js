const runAuthorizedCommand = require('../helpers/run_authorized_command');
const runGroupCommand = require('../helpers/run_group_command');
const handlePromiseWithMessage = require('../helpers/handle_promise_with_message');
const showServer = require('../helpers/show_server');
const messages = require('../locale/messages');

const start = ({
    serverQueue,
    discordCommand,
}) => {
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
};

module.exports = start;

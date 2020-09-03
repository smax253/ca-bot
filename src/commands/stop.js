const runAuthorizedCommand = require('../helpers/run_authorized_command');
const runGroupCommand = require('../helpers/run_group_command');
const handlePromiseWithMessage = require('../helpers/handle_promise_with_message');
const hideServer = require('../helpers/hide_server');
const messages = require('../locale/messages');
const runCommandIfActive = require('../helpers/run_command_if_active');

const stop = ({
    serverQueue,
    discordCommand,
}) => {
    runAuthorizedCommand({ serverQueue, discordCommand }, () => {
        runGroupCommand({ serverQueue, discordCommand }, () => {
            runCommandIfActive({ serverQueue, discordCommand }, () => {
                const users = serverQueue.stopQueue(
                    discordCommand.getServerId(),
                    discordCommand.getParentId(),
                );
                if (users) {
                    handlePromiseWithMessage({
                        promise: hideServer({
                            parentCategoryServer: discordCommand.getParent(),
                        }),
                        discordCommand,
                        successMessage: messages.OFFICE_HOURS_STOPPED,
                        failureMessage: messages.UNKNOWN_ERROR,
                    });
                }
                else {
                    discordCommand.sendMessage(
                        messages.OFFICE_HOURS_NOT_ACTIVE,
                    );
                }
            });
        });
    });
};

module.exports = stop;

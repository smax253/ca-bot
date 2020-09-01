const handlePromiseWithMessage = ({
    promise,
    discordCommand,
    successMessage,
    failureMessage,
}) => {
    promise.then(() => {
        discordCommand.sendMessage(successMessage);
    }).catch((error) => {
        console.error(error);
        discordCommand.sendMessage(failureMessage);
    });
};
module.exports = handlePromiseWithMessage;

const sendMessageWithBoolean = ({
    result,
    discordCommand,
    trueMessage,
    falseMessage,
}) => {
    result
        ? discordCommand.sendMessage(trueMessage)
        : discordCommand.sendMessage(falseMessage);
};

module.exports = sendMessageWithBoolean;

const checkArgs = (discordCommand) => {
    return !!discordCommand.getArgs();
};

module.exports = checkArgs;

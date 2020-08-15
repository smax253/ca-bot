const DiscordCommand = function({
    message,
    command,
    args,
    isCommand,
}) {
    this.getContent = () => message.content;
    this.getAuthor = () => message.author;
    this.getServer = () => message.channel.guild;
    this.getChannel = () => message.channel;
    this.getCommand = () => command;
    this.getArgs = () => args;
    this.getIsCommand = () => isCommand;
    this.toObject = () => {
        return {
            content: this.getContent(),
            author: this.getAuthor(),
            server: this.getServer(),
            command: this.getCommand(),
            args: this.getArgs(),
            isCommand: this.getIsCommand(),
            channel: this.getChannel(),
        };
    };
};

module.exports = DiscordCommand;

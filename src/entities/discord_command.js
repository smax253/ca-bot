const DiscordCommand = function({
    message,
    command,
    args,
    isCommand,
}) {
    this.getContent = () => message.content;
    this.getAuthor = () => message.author;
    this.getAuthorId = () => message.author.id;
    this.getServer = () => message.channel.guild;
    this.getServerId = () => message.channel.guild.id;
    this.getChannel = () => message.channel;
    this.getCommand = () => command;
    this.getArgs = () => args;
    this.getIsCommand = () => isCommand;
    this.sendMessage = (msg) => message.channel.send(msg);
    this.getRoles = () => message.member.roles;
    this.getOwnerId = () => message.channel.guild.ownerID;
    this.getChannelManager = () => message.channel.guild.channels;
    this.toObject = () => {
        return {
            content: this.getContent(),
            author: this.getAuthor(),
            server: this.getServer(),
            command: this.getCommand(),
            args: this.getArgs(),
            isCommand: this.getIsCommand(),
            channel: this.getChannel(),
            serverId: this.getServerId(),
            authorId: this.getAuthorId(),
            roles: this.getRoles(),
            ownerId: this.getOwnerId(),
            channelManager: this.getChannelManager(),
        };
    };
};

module.exports = DiscordCommand;

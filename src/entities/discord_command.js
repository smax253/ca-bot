const DiscordCommand = function({
    message,
    command,
    args,
    isCommand,
}) {
    this.getContent = () => message.content;
    this.getAuthorId = () => message.author.id;
    this.getServer = () => message.channel.guild;
    this.getServerId = () => message.channel.guild.id;
    this.getChannel = () => message.channel;
    this.getCommand = () => command;
    this.getArgs = () => args;
    this.getIsCommand = () => isCommand;
    this.sendMessage = (msg) => message.channel.send(msg);
    this.getRoles = () => message.member.roles.cache;
    this.getOwnerId = () => message.channel.guild.ownerID;
    this.getChannelManager = () => message.channel.guild.channels;
    this.getParentId = () => message.channel.parentID;
    this.getParent = () => message.channel.parent;
    this.getDisplayName = () => message.member.displayName;
    this.getMember = () => message.member;
    this.toObject = () => {
        return {
            content: this.getContent(),
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
            parentId: this.getParentId(),
            parent: this.getParent(),
            displayName: this.getDisplayName(),
            member: this.getMember(),
        };
    };
};

module.exports = DiscordCommand;

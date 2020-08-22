const isAuthorized = ({ serverQueue, discordCommand }) => {
    return discordCommand.getOwnerId() === discordCommand.getAuthorId()
        || serverQueue.isAdmin(discordCommand.getServerId(), discordCommand.getRoles());
};

module.exports = isAuthorized;

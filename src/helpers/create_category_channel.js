const createCategoryChannel = ({
    roomName,
    channelManager,
    everyoneRole,
    selfRole,
}) => {
    return channelManager.create(roomName, {
        type: 'category',
        permissionOverwrites: [
            {
                id: everyoneRole,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: selfRole,
                allow: ['VIEW_CHANNEL', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
            },
        ],
    });
};
module.exports = createCategoryChannel;

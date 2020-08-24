const createChildChannels = ({
    channelManager,
    roomName,
    selfRole,
    parent,
}) => {
    const result = [];
    result.push(channelManager.create('no-mic', {
        topic: 'General text chat for '.concat(roomName),
        parent: parent,
        permissionOverwrites: [
            {
                id: selfRole,
                deny: ['VIEW_CHANNEL'],
            },
        ],
    }));
    result.push(channelManager.create('bot-commands', {
        topic: 'Bot commands for '.concat(roomName),
        parent: parent,
    }));
    result.push(channelManager.create('1-on-1', {
        type: 'voice',
        parent: parent,
        userLimit: 2,
    }));
    result.push(channelManager.create('Office', {
        type: 'voice',
        parent: parent,
    }));
    return result;
};

module.exports = createChildChannels;

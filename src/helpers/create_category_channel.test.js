const createCategoryChannel = require('./create_category_channel');

describe('HELPER: Create overarching category channel', () => {
    let channelManager, result;
    beforeEach(() => {
        const roomName = 'roomName';
        const everyoneRole = 'everyoneRole';
        const selfRole = 'selfRole';
        channelManager = {
            create: jest.fn().mockReturnValue('channel'),
        };
        result = createCategoryChannel({
            roomName, channelManager, everyoneRole, selfRole,
        });
    });
    it('creates a channel with the correct arguments', () => {
        expect(channelManager.create).toHaveBeenCalledWith(
            'roomName',
            {
                type: 'category',
                permissionOverwrites: [
                    {
                        id: 'everyoneRole',
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: 'selfRole',
                        allow: ['VIEW_CHANNEL', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
                    },
                ],
            },
        );
    });
    it('returns the result of the create call', () => {
        expect(result).toEqual('channel');
    });
});

const createChildChannels = require('./create_child_channels');
describe('HELPER: createChildChannels', () => {
    let result;
    beforeEach(() => {
        const channelManager = {
            create: jest.fn().mockImplementation((...args) => {
                return args;
            }),
        };
        const roomName = 'roomName';
        const selfRole = 'selfRole';
        const parent = 'parent';
        result = createChildChannels({
            channelManager, roomName, selfRole, parent,
        });
    });
    it('should return an array with four created channels', () => {
        expect(result.length).toEqual(4);
    });
    it('should create a general text chat channel as the first channel', () => {
        expect(result[0][0]).toEqual('no-mic');
        expect(result[0][1]).toEqual({
            topic: 'General text chat for '.concat('roomName'),
            parent: 'parent',
            permissionOverwrites: [
                {
                    id: 'selfRole',
                    deny: ['VIEW_CHANNEL'],
                },
            ],
        });
    });
    it('creates a bot command channel as the second channel', () => {
        expect(result[1][0]).toEqual('bot-commands');
        expect(result[1][1]).toEqual({
            topic: 'Bot commands for '.concat('roomName'),
            parent: 'parent',
        });
    });
    it('creates a 1-on-1 voice channel as the third channel', () => {
        expect(result[2][0]).toEqual('1-on-1');
        expect(result[2][1]).toEqual({
            type: 'voice',
            parent: 'parent',
            userLimit: 2,
        });
    });
    it('creates a general office voice channel for the fourth channel', () => {
        expect(result[3][0]).toEqual('Office');
        expect(result[3][1]).toEqual({
            type: 'voice',
            parent: 'parent',
        });
    });
});

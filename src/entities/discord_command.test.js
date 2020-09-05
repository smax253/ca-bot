const DiscordCommand = require('./discord_command');

describe('ENTITY: DiscordCommand', () => {
    let actual, expected, sendSpy;
    beforeEach(() => {
        sendSpy = jest.fn();
        expected = {
            content: 'content',
            server: {
                id: 'guild',
                ownerID: 'ownerID',
                channels: 'channelManager',
            },
            serverId: 'guild',
            authorId: 'author',
            command: 'command',
            args: 'args',
            isCommand: true,
            channel: {
                guild: {
                    id: 'guild',
                    ownerID: 'ownerID',
                    channels: 'channelManager',
                },
                send: sendSpy,
                parentID: 'parentID',
                parent: 'parent',
            },
            roles: 'roles',
            ownerId: 'ownerID',
            channelManager: 'channelManager',
            parent: 'parent',
            parentId: 'parentID',
            displayName: 'displayName',
            member: {
                roles: 'roles',
                displayName: 'displayName',
            },
        };
        actual = new DiscordCommand({
            message: {
                content: 'content',
                author: {
                    id: 'author',
                },
                channel: {
                    guild: {
                        id: 'guild',
                        ownerID: 'ownerID',
                        channels: 'channelManager',
                    },
                    send: sendSpy,
                    parentID: 'parentID',
                    parent: 'parent',
                },
                member: {
                    roles: 'roles',
                    displayName: 'displayName',
                },
            },
            command: 'command',
            args: 'args',
            isCommand: true,
        });
    });
    it('creates an entity of the DiscordMessage', () => {
        expect(actual.toObject()).toEqual(expected);
    });
    it('creates a wrapper for sending messages', () => {
        actual.sendMessage('msg');
        expect(sendSpy).toHaveBeenCalledWith('msg');
    });
});

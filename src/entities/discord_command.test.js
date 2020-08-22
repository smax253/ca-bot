const DiscordCommand = require('./discord_command');

describe('ENTITY: DiscordCommand', () => {
    let actual, expected, sendSpy;
    beforeEach(() => {
        sendSpy = jest.fn();
        expected = {
            content: 'content',
            author: {
                id: 'author',
            },
            server: {
                id: 'guild',
                ownerID: 'ownerID',
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
                },
                send: sendSpy,
            },
            roles: 'roles',
            ownerId: 'ownerID',
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
                    },
                    send: sendSpy,
                },
                member: {
                    roles: 'roles',
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

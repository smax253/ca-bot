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
            },
            serverId: 'guild',
            authorId: 'author',
            command: 'command',
            args: 'args',
            isCommand: true,
            channel: {
                guild: {
                    id: 'guild',
                },
                send: sendSpy,
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
                    },
                    send: sendSpy,
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

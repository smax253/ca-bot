const DiscordCommand = require('./discord_command.js');

describe('ENTITY: DiscordCommand', () => {
    let actual, expected;
    beforeEach(() => {
        expected = {
            content: 'content',
            author: 'author',
            server: 'guild',
            command: 'command',
            args: 'args',
            isCommand: true,
            channel: {
                guild: 'guild',
            },
        };
        actual = new DiscordCommand({
            message: {
                content: 'content',
                author: 'author',
                channel: {
                    guild: 'guild',
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
});

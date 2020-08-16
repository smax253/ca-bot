const parseCommand = require('./parse_command');
jest.mock('../entities/discord_command', () => {
    return jest.fn().mockImplementation((args) => {
        return {
            ...args,
        };
    });
});

describe('HELPER: Extract command from message body', () => {
    let expected, actual, message;
    describe('when message is a command', () => {
        beforeEach(() => {
            expected = {
                isCommand: true,
            };
        });
        describe('when the message has command and no arguments', () => {
            beforeEach(() => {
                message = {
                    content: '!queue',
                };
                expected.message = message;
                expected.command = '!queue';
                expected.args = '';
                actual = parseCommand(
                    message,
                );
            });
            it('should return an object representing the command', () => {
                expect(actual).toEqual(expected);
            });
        });
        describe('when the message has command and some arguments', () => {
            beforeEach(() => {
                message = {
                    content: '!queue private',
                };
                expected.message = message;
                expected.command = '!queue';
                expected.args = 'private';
                actual = parseCommand(
                    message,
                );
            });
            it('should return an object representing the command', () => {
                expect(actual).toEqual(expected);
            });
        });
    });
    describe('when the message has no command', () => {
        beforeEach(() => {
            message = {
                content: 'not a command',
            };
            actual = parseCommand(
                message,
            );
        });
        it('should return null', () => {
            expect(actual).toEqual(null);
        });
    });
});

const parseCommand = require('./parse_command.js');
jest.mock('../entities/discord_command.js', () => {
    return jest.fn().mockImplementation((args) => {
        return {
            ...args,
        };
    });
});

describe('HELPER: Extract command from message body', () => {
    let expected, actual, message;
    describe('when the message has command and no arguments', () => {
        beforeEach(() => {
            message = {
                content: '!queue',
            };
            expected = {
                isCommand: true,
                command: '!queue',
                args: '',
                message,
            };
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
            expected = {
                isCommand: true,
                command: '!queue',
                args: 'private',
                message,
            };
            actual = parseCommand(
                message,
            );
        });
        it('should return an object representing the command', () => {
            expect(actual).toEqual(expected);
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

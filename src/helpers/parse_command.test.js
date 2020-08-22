const parseCommand = require('./parse_command');

jest.mock('../entities/discord_command', () => {
    return jest.fn().mockImplementation((args) => {
        return {
            ...args,
        };
    });
});

jest.mock('../locale/commands', () => {
    return {
        commands: {
            queue: 'queue',
        },
        prefix: '!',
    };
});

describe('HELPER: Extract command from message body', () => {
    let expected, actual, message;
    describe('when message begins with the command prefix', () => {
        describe('when message is a valid command', () => {
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
                    expected.command = 'queue';
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
                        content: '!queue role name',
                    };
                    expected.message = message;
                    expected.command = 'queue';
                    expected.args = 'role name';
                    actual = parseCommand(
                        message,
                    );
                });
                it('should return an object representing the command', () => {
                    expect(actual).toEqual(expected);
                });
            });
        });
        describe('when message is not a valid command', () => {
            beforeEach(() => {
                message = {
                    content: '!nocommand',
                };
                expected = {
                    isCommand: false,
                    message: message,
                };
                actual = parseCommand(message);
            });
            it('should return an object representing the invalid command', () => {
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

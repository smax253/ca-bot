jest.mock('./locale/commands', () => {
    return {
        commands: {
            queue: 'queue',
        },
        prefix: '!',
    };
});
const commands = require('./locale/messages');

jest.mock('./helpers/execute_command');
const executeCommandMock = require('./helpers/execute_command');

const listener = require('./discord_message_listener');

jest.mock('./helpers/parse_command');
const parseCommandMock = require('./helpers/parse_command');

describe('discord_message_listener', () => {
    let fakeClient;
    beforeEach(() => {
        fakeClient = {
            on: jest.fn(),
            login: jest.fn(),
            user: {
                tag: 'username',
                id: 'botId',
            },
        };
        const args = {
            queue: 'queue',
            client: fakeClient,
            discordKey: 'discordKey',
        };
        jest.spyOn(console, 'log');
        console.log.mockImplementation(() => {});
        listener(args);
    });
    it('should call login with the key', () => {
        expect(fakeClient.login).toHaveBeenCalledWith('discordKey');
    });
    it('should call on with "ready"', () => {
        expect(fakeClient.on).toHaveBeenCalledWith('ready', expect.any(Function));
    });
    describe('on ready callback', () => {
        let readyCallback;
        beforeEach(() => {
            readyCallback = fakeClient.on.mock.calls.find((call) => call[0] === 'ready')[1];
            readyCallback();
        });
        it('should log a message to console', () => {
            expect(console.log).toHaveBeenCalledWith(`Logged in as ${fakeClient.user.tag}`);
        });
    });
    describe('on message callback', () => {
        let messageCallback, message, sendSpy;
        beforeEach(() => {
            sendSpy = jest.fn();
            parseCommandMock.mockReturnValue(null);
            messageCallback = fakeClient.on.mock.calls.find((call) => call[0] === 'message')[1];
        });
        describe('when message is from the bot', () => {
            beforeEach(() => {
                parseCommandMock.mockReset();
                sendSpy.mockReset();
                executeCommandMock.mockReset();
                message = {
                    content: 'command',
                    channel: {
                        send: sendSpy,
                    },
                    author: fakeClient.user,
                };
                messageCallback(message);
            });
            it('does not call parseCommand', () => {
                expect(parseCommandMock).not.toHaveBeenCalled();
            });
            it('does not call send', () => {
                expect(sendSpy).not.toHaveBeenCalled();
            });
            it('does not call executeCommand', () => {
                expect(executeCommandMock).not.toHaveBeenCalled();
            });
        });
        describe('when the message is not from a bot', () => {
            beforeEach(() => {
                message = {
                    content: 'command',
                    channel: {
                        send: sendSpy,
                    },
                    author: {
                        id: 'userId',
                    },
                };
                messageCallback(message);
            });
            it('calls command parser', () => {
                expect(parseCommandMock).toHaveBeenCalledWith(message);
            });
            describe('when parsed command is null', () => {
                beforeEach(() => {
                    parseCommandMock.mockReturnValue(null);
                    messageCallback(message);
                });
                it('does not send a message', () => {
                    expect(sendSpy).not.toHaveBeenCalled();
                });
            });
            describe('when parsed command is not a command', () => {
                beforeEach(() => {
                    parseCommandMock.mockReturnValue({
                        getIsCommand: jest.fn().mockReturnValue(false),
                    });
                    messageCallback(message);
                });
                it('prints not a command message', () => {
                    expect(sendSpy).toHaveBeenCalledWith(commands.UNKNOWN_COMMAND);
                });
            });
            describe('when parsed command is a command', () => {
                let command;
                beforeEach(() => {
                    command = {
                        getIsCommand: jest.fn().mockReturnValue(true),
                    };
                    executeCommandMock.mockImplementation(() => {});
                    parseCommandMock.mockReturnValue(
                        command,
                    );
                    messageCallback(message);
                });
                it('calls the execute command helper with the message and the queue', () => {
                    expect(executeCommandMock).toHaveBeenCalledWith({
                        discordCommand: command,
                        serverQueue: 'queue',
                    });
                });
            });
        });
    });
});

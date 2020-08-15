const listener = require('./discord_message_listener.js');

jest.mock('./helpers/parse_command.js');
const parseCommandMock = require('./helpers/parse_command.js');

jest.mock('./helpers/execute_command.js');
const executeCommandMock = require('./helpers/execute_command.js');

const commands = require('./messages');

describe('discord_message_listener.js', () => {
    let fakeClient;
    beforeEach(() => {
        fakeClient = {
            on: jest.fn(),
            login: jest.fn(),
            user: {
                tag: 'username',
            },
        };
        const args = {
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
            message = {
                content: 'command',
                channel: {
                    send: sendSpy,
                },
            };
            messageCallback = fakeClient.on.mock.calls.find((call) => call[0] === 'message')[1];
            messageCallback(message);
        });
        it('calls command parser', () => {
            expect(parseCommandMock).toHaveBeenCalledWith(message);
        });
        describe('when parsed command is not a command', () => {
            beforeEach(() => {
                parseCommandMock.mockReturnValue(null);
                messageCallback(message);
            });
            it('prints not a command message', () => {
                expect(sendSpy).toHaveBeenCalledWith(commands.UNKNOWN_COMMAND);
            });
        });
        describe('when parsed command is a command', () => {
            beforeEach(() => {
                executeCommandMock.mockImplementation(() => {});
                parseCommandMock.mockReturnValue('command');
                messageCallback(message);
            });
            it('calls the execute command helper with the message', () => {
                expect(executeCommandMock).toHaveBeenCalledWith('command');
            });
        });
    });
});
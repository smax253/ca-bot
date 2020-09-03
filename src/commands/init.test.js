const init = require('./init');
jest.mock('../helpers/run_authorized_command');
const runAuthorizedCommand = require('../helpers/run_authorized_command');
jest.mock('../helpers/send_message_with_boolean');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const messages = require('../locale/messages');

describe('COMMAND: init', () => {
    let serverQueue, discordCommand;
    beforeEach(() => {
        runAuthorizedCommand.mockImplementation(() => {});
        sendMessageWithBoolean.mockImplementation(() => {});
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
        };
        serverQueue = {
            initServer: jest.fn().mockReturnValue('initServerResult'),
        };
        init({ discordCommand, serverQueue });
    });
    it('calls runAuthorizedCommand helper', () => {
        expect(runAuthorizedCommand).toHaveBeenCalledWith({ serverQueue, discordCommand }, expect.any(Function));
    });
    describe('runAuthorizedCommand callback', () => {
        beforeEach(() => {
            runAuthorizedCommand.mockClear();
            init({ discordCommand, serverQueue });
            const callback = runAuthorizedCommand.mock.calls[0][1];
            callback();
        });
        it('runs serverQueue.initServer with the serverId', () => {
            expect(serverQueue.initServer).toHaveBeenCalledWith('serverId');
        });
        it('calls sendMessageWithBoolean helper with the correct values', () => {
            expect(sendMessageWithBoolean).toHaveBeenCalledWith({
                result: 'initServerResult',
                discordCommand,
                trueMessage: messages.INITIALIZATION_SUCCESS,
                falseMessage: messages.INITIALIZATION_ALREADY_EXISTS,
            });
        });
    });
});

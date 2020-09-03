jest.mock('../helpers/run_authorized_command');
const runAuthorizedCommand = require('../helpers/run_authorized_command');
jest.mock('../helpers/send_message_with_boolean');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const messages = require('../locale/messages');
const addadmin = require('./addadmin');

describe('COMMAND: addadmin', () => {
    let serverQueue, discordCommand;
    beforeEach(() => {
        runAuthorizedCommand.mockImplementation(() => {});
        sendMessageWithBoolean.mockImplementation(() => {});
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
            getArgs: jest.fn().mockReturnValue('args'),
        };
        serverQueue = {
            addAdmin: jest.fn().mockReturnValue('addAdminResult'),
        };
        addadmin({ discordCommand, serverQueue });
    });
    it('calls runAuthorizedCommand helper', () => {
        expect(runAuthorizedCommand).toHaveBeenCalledWith({ serverQueue, discordCommand }, expect.any(Function));
    });
    describe('runAuthorizedCommand callback', () => {
        beforeEach(() => {
            runAuthorizedCommand.mockClear();
            addadmin({ discordCommand, serverQueue });
            const callback = runAuthorizedCommand.mock.calls[0][1];
            callback();
        });
        it('runs serverQueue.addAdmin with the serverId and args', () => {
            expect(serverQueue.addAdmin).toHaveBeenCalledWith('serverId', 'args');
        });
        it('calls sendMessageWithBoolean helper with the correct values', () => {
            expect(sendMessageWithBoolean).toHaveBeenCalledWith({
                result: 'addAdminResult',
                discordCommand,
                trueMessage: messages.ADMIN_ADDED,
                falseMessage: messages.ADMIN_ALREADY_ADDED,
            });
        });
    });
});

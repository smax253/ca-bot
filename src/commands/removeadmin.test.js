jest.mock('../helpers/run_authorized_command');
const runAuthorizedCommand = require('../helpers/run_authorized_command');
jest.mock('../helpers/send_message_with_boolean');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const messages = require('../locale/messages');
const removeadmin = require('./removeadmin');


describe('COMMAND: remove admin role', () => {
    let serverQueue, discordCommand;
    beforeEach(() => {
        runAuthorizedCommand.mockImplementation(() => {});
        sendMessageWithBoolean.mockImplementation(() => {});
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
            getArgs: jest.fn().mockReturnValue('args'),
        };
        serverQueue = {
            removeAdmin: jest.fn().mockReturnValue('removeAdminResult'),
        };
        removeadmin({ discordCommand, serverQueue });
    });
    it('calls runAuthorizedCommand helper', () => {
        expect(runAuthorizedCommand).toHaveBeenCalledWith({ serverQueue, discordCommand }, expect.any(Function));
    });
    describe('runAuthorizedCommand callback', () => {
        beforeEach(() => {
            runAuthorizedCommand.mockClear();
            removeadmin({ discordCommand, serverQueue });
            runAuthorizedCommand.mock.calls[0][1]();
        });
        it('runs serverQueue.removeAdmin with the serverId and args', () => {
            expect(serverQueue.removeAdmin).toHaveBeenCalledWith('serverId', 'args');
        });
        it('calls sendMessageWithBoolean helper with the correct values', () => {
            expect(sendMessageWithBoolean).toHaveBeenCalledWith({
                result: 'removeAdminResult',
                discordCommand,
                trueMessage: messages.ADMIN_REMOVED,
                falseMessage: messages.ADMIN_NOT_FOUND,
            });
        });
    });
});

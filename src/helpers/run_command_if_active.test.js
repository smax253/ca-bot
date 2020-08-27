const runCommandIfActive = require('./run_command_if_active');
const messages = require('../locale/messages');

describe('HELPER: run command if server is active', () => {
    let discordCommand, serverQueue, command;
    beforeEach(() => {
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
            getParentId: jest.fn().mockReturnValue('parentId'),
            sendMessage: jest.fn(),
        };
        serverQueue = {
            isActive: jest.fn(),
        };
        command = jest.fn();
        runCommandIfActive({ discordCommand, serverQueue }, command);
    });
    it('runs serverQueue.isActive with the serverId and groupId', () => {
        expect(serverQueue.isActive).toHaveBeenCalledWith('serverId', 'parentId');
    });
    describe('when office is active', () => {
        beforeEach(() => {
            command.mockClear();
            serverQueue.isActive.mockReturnValue(true);
            runCommandIfActive({ discordCommand, serverQueue }, command);
        });
        it('runs the command', () => {
            expect(command).toHaveBeenCalled();
        });
    });
    describe('when office is not active', () => {
        beforeEach(() => {
            discordCommand.sendMessage.mockClear();
            serverQueue.isActive.mockReturnValue(false);
            runCommandIfActive({ discordCommand, serverQueue }, command);
        });
        it('runs the command', () => {
            expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.OFFICE_HOURS_NOT_ACTIVE);
        });
    });
});

const runGroupCommand = require('./run_group_command');
const messages = require('../locale/messages');

describe('HELPER: run group command', () => {
    let serverQueue, discordCommand, command;
    beforeEach(() => {
        serverQueue = {
            isGroup: jest.fn(),
        };
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
            getParentId: jest.fn().mockReturnValue('parentId'),
            sendMessage: jest.fn(),
        };
        command = jest.fn();
        runGroupCommand({ serverQueue, discordCommand }, command);
    });
    it('calls serverQueue.isGroup with getServerId, getParentId', () => {
        expect(serverQueue.isGroup).toHaveBeenCalledWith('serverId', 'parentId');
    });
    describe('when message is sent from group', () => {
        beforeEach(() => {
            serverQueue.isGroup.mockReturnValue(true);
            runGroupCommand({ serverQueue, discordCommand }, command);
        });
        it('runs the command', () => {
            expect(command).toHaveBeenCalled();
        });
    });
    describe('when message is not sent from group', () => {
        beforeEach(() => {
            serverQueue.isGroup.mockReturnValue(false);
            runGroupCommand({ serverQueue, discordCommand }, command);
        });
        it('runs the command', () => {
            expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.OFFICE_HOURS_WRONG_CHANNEL);
        });
    });
});

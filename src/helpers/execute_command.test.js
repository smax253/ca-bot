const executeCommand = require('./execute_command');
const messages = require('../messages');

describe('HELPER: executeCommand', () => {
    let serverQueue, discordCommand;
    beforeEach(() => {
        serverQueue = {
            initServer: jest.fn(),
        };
        discordCommand = {
            getServer: jest.fn().mockReturnValue({
                id: 'serverId',
            }),
            sendMessage: jest.fn(),
        };
    });
    describe('when command is !init', () => {
        beforeEach(() => {
            discordCommand.getCommand = jest.fn().mockReturnValue('!init');
            executeCommand({
                serverQueue, discordCommand,
            });
        });
        it('should call discordCommand.getServer to get the server ID', () => {
            expect(discordCommand.getServer).toHaveBeenCalled();
        });
        it('should call serverQueue.initServer with the id', () => {
            expect(serverQueue.initServer).toHaveBeenCalledWith('serverId');
        });
        describe('when initServer returns true', () => {
            beforeEach(() => {
                serverQueue.initServer.mockReturnValue(true);
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should send a message confirming initialization', () => {
                expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.INITIALIZATION_SUCCESS);
            });
        });
        describe('when initServer returns false', () => {
            beforeEach(() => {
                serverQueue.initServer.mockReturnValue(false);
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should send a message confirming initialization', () => {
                expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.INITIALIZATION_ALREADY_EXISTS);
            });
        });
    });
});

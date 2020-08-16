const executeCommand = require('./execute_command');
const messages = require('../messages');

describe('HELPER: executeCommand', () => {
    let serverQueue, discordCommand;
    beforeEach(() => {
        serverQueue = {
            initServer: jest.fn(),
            queue: jest.fn(),
        };
        discordCommand = {
            getServer: jest.fn().mockReturnValue({
                id: 'serverId',
            }),
            sendMessage: jest.fn(),
            getAuthor: jest.fn().mockReturnValue('student'),
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
    describe('when command is !queue or !q', () => {
        beforeEach(() => {
            discordCommand.sendMessage.mockReset();
        });
        describe('when command is !queue', () => {
            beforeEach(() => {
                discordCommand.getCommand = jest.fn().mockReturnValue('!queue');
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should call serverQueue.queue with the serverId and student', () => {
                expect(serverQueue.queue).toHaveBeenCalledWith('serverId', 'student');
            });
            describe('when queue returns false', () => {
                beforeEach(() => {
                    serverQueue.queue.mockReturnValue(false);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('should send a message that says the user is already in queue', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.QUEUE_ALREADY_QUEUED);
                });
            });
            describe('when queue returns true', () => {
                beforeEach(() => {
                    serverQueue.queue.mockReturnValue(true);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('should send a message that says the user is already in queue', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.QUEUE_SUCCESS);
                });
            });
        });
        describe('when command is !q', () => {
            beforeEach(() => {
                discordCommand.getCommand = jest.fn().mockReturnValue('!q');
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should call serverQueue.queue with the serverId and student', () => {
                expect(serverQueue.queue).toHaveBeenCalledWith('serverId', 'student');
            });
            describe('when queue returns false', () => {
                beforeEach(() => {
                    serverQueue.queue.mockReturnValue(false);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('should send a message that says the user is already in queue', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.QUEUE_ALREADY_QUEUED);
                });
            });
            describe('when queue returns true', () => {
                beforeEach(() => {
                    serverQueue.queue.mockReturnValue(true);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('should send a message that says the user is already in queue', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.QUEUE_SUCCESS);
                });
            });
        });
    });
});

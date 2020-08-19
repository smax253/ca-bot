const executeCommand = require('./execute_command');
const messages = require('../locale/messages');

describe('HELPER: executeCommand', () => {
    let serverQueue, discordCommand;
    beforeEach(() => {
        serverQueue = {
            initServer: jest.fn(),
            queue: jest.fn(),
            dequeue: jest.fn(),
            remove: jest.fn(),
        };
        discordCommand = {
            getServer: jest.fn(),
            getServerId: jest.fn().mockReturnValue('serverId'),
            sendMessage: jest.fn(),
            getAuthor: jest.fn().mockReturnValue('student'),
        };
    });
    describe('when command is init', () => {
        beforeEach(() => {
            discordCommand.getCommand = jest.fn().mockReturnValue('init');
            executeCommand({
                serverQueue, discordCommand,
            });
        });
        it('should call discordCommand.getServerId to get the server ID', () => {
            expect(discordCommand.getServerId).toHaveBeenCalled();
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
            it('should send a message notifying that server is already initialized', () => {
                expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.INITIALIZATION_ALREADY_EXISTS);
            });
        });
    });
    describe('queue manipulation commands', () => {
        describe('when command is queue', () => {
            beforeEach(() => {
                discordCommand.getCommand = jest.fn().mockReturnValue('queue');
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should call serverQueue.queue with the serverId and student', () => {
                expect(serverQueue.queue).toHaveBeenCalledWith('serverId', 'student');
            });
            const cases = [true, false];
            const strings = [messages.QUEUE_SUCCESS, messages.QUEUE_ALREADY_QUEUED];
            const zipped = cases.map((val, ind) => [val, strings[ind]]);
            describe.each(zipped)('when method returns %p', (value, msg) => {
                beforeEach(() => {
                    serverQueue.queue.mockReturnValue(value);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('should send a the correct message', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(msg);
                });
            });
        });
        describe('when command is dequeue', () => {
            beforeEach(() => {
                discordCommand.getCommand = jest.fn().mockReturnValue('dequeue');
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should call serverQueue.dequeue with the serverId', () => {
                expect(serverQueue.dequeue).toHaveBeenCalledWith('serverId');
            });
            const cases = ['user', null];
            const strings = [messages.DEQUEUE_SUCCESS, messages.DEQUEUE_NOT_FOUND];
            const zipped = cases.map((val, ind) => [val, strings[ind]]);
            describe.each(zipped)('when method returns %p', (value, msg) => {
                beforeEach(() => {
                    serverQueue.dequeue.mockReturnValue(value);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('should print the correct message', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(msg);
                });
            });
        });
        describe('when command is remove', () => {
            beforeEach(() => {
                discordCommand.getCommand = jest.fn().mockReturnValue('remove');
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should call serverQueue.dequeue with the serverId and student', () => {
                expect(serverQueue.remove).toHaveBeenCalledWith('serverId', 'student');
            });
            const cases = [true, false];
            const strings = [messages.REMOVE_SUCCESS, messages.REMOVE_NOT_FOUND];
            const zipped = cases.map((val, ind) => [val, strings[ind]]);
            describe.each(zipped)('when method returns %p', (value, msg) => {
                beforeEach(() => {
                    serverQueue.remove.mockReturnValue(value);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('should print the correct message', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(msg);
                });
            });
        });
    });
});

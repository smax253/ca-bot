const executeCommand = require('./execute_command');
const messages = require('../locale/messages');
jest.mock('./is_authorized');
const isAuthorized = require('./is_authorized');

describe('HELPER: executeCommand', () => {
    let serverQueue, discordCommand, client;
    beforeEach(() => {
        client = {
            on: jest.fn(),
            login: jest.fn(),
            user: {
                tag: 'username',
                id: 'botId',
            },
        };
        serverQueue = {
            initServer: jest.fn(),
            queue: jest.fn(),
            dequeue: jest.fn(),
            remove: jest.fn(),
            addAdmin: jest.fn(),
            removeAdmin: jest.fn(),
            createRoom: jest.fn(),
        };
        discordCommand = {
            getServer: jest.fn(),
            getServerId: jest.fn().mockReturnValue('serverId'),
            sendMessage: jest.fn(),
            getAuthor: jest.fn().mockReturnValue('student'),
            getArgs: jest.fn(),
            getChannelManager: jest.fn().mockReturnValue('channelManager'),
        };
    });
    describe('when command is init', () => {
        beforeEach(() => {
            discordCommand.getCommand = jest.fn().mockReturnValue('init');
            executeCommand({
                serverQueue, discordCommand,
            });
        });
        it('should call isAuthorized', () => {
            expect(isAuthorized).toHaveBeenCalledWith({ serverQueue, discordCommand });
        });
        describe('when isAuthorized returns true', () => {
            beforeEach(() => {
                isAuthorized.mockReturnValue(true);
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
                    discordCommand.sendMessage.mockClear();
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
                    discordCommand.sendMessage.mockClear();
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
        describe('when isAuthorized returns false', () => {
            beforeEach(() => {
                discordCommand.sendMessage.mockClear();
                isAuthorized.mockReturnValue(false);
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should print a not authorized message', () => {
                expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.NOT_AUTHORIZED);
            });
        });
    });
    describe('when command is addadmin', () => {
        beforeEach(() => {
            discordCommand.getCommand = jest.fn().mockReturnValue('addadmin');
            executeCommand({
                serverQueue, discordCommand,
            });
        });
        it('should call isAuthorized', () => {
            expect(isAuthorized).toHaveBeenCalledWith({ serverQueue, discordCommand });
        });
        describe('when isAuthorized returns true', () => {
            beforeEach(() => {
                isAuthorized.mockReturnValue(true);
                discordCommand.getArgs.mockReturnValue('new role');
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('calls serverQueue.addAdmin with the serverId and the arguments', () => {
                expect(serverQueue.addAdmin).toHaveBeenCalledWith('serverId', 'new role');
            });
            describe('when addAdmin returns true', () => {
                beforeEach(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.addAdmin.mockReturnValue(true);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('prints a successfully added message', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.ADMIN_ADDED);
                });
            });
            describe('when addAdmin returns false', () => {
                beforeEach(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.addAdmin.mockReturnValue(false);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('prints an already added message', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.ADMIN_ALREADY_ADDED);
                });
            });
        });
        describe('when isAuthorized returns false', () => {
            beforeEach(() => {
                discordCommand.sendMessage.mockClear();
                isAuthorized.mockReturnValue(false);
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should print a not authorized message', () => {
                expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.NOT_AUTHORIZED);
            });
        });
    });
    describe('when command is createroom', () => {
        beforeEach(() => {
            console.error = jest.fn();
            serverQueue.createRoom.mockImplementation(() => Promise.reject(true));
            discordCommand.getCommand = jest.fn().mockReturnValue('createroom');
            executeCommand({
                serverQueue, discordCommand, client,
            });
        });
        it('should call isAuthorized', () => {
            expect(isAuthorized).toHaveBeenCalledWith({ serverQueue, discordCommand });
        });
        describe('when isAuthorized returns true', () => {
            beforeEach(() => {
                isAuthorized.mockReturnValue(true);
                discordCommand.getArgs.mockReturnValue('new room');
                executeCommand({
                    serverQueue, discordCommand, client,
                });
            });
            it('calls serverQueue.createRoom with the serverId and the arguments', () => {
                expect(serverQueue.createRoom).toHaveBeenCalledWith('serverId', 'new room', 'channelManager', client.user);
            });
            describe('when createRoom returns a promise that resolves to true', () => {
                beforeEach(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.createRoom.mockImplementation(() => Promise.resolve(true));
                    executeCommand({
                        serverQueue, discordCommand, client,
                    });
                });
                it('prints a successfully added message', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.ROOM_CREATED);
                });
            });
            describe('when createRoom returns false', () => {
                beforeEach(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.createRoom.mockImplementation(() => Promise.resolve(false));
                    executeCommand({
                        serverQueue, discordCommand, client,
                    });
                });
                it('prints an already added message', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.ROOM_NOT_CREATED);
                });
            });
        });
        describe('when isAuthorized returns false', () => {
            beforeEach(() => {
                discordCommand.sendMessage.mockClear();
                isAuthorized.mockReturnValue(false);
                executeCommand({
                    serverQueue, discordCommand, client,
                });
            });
            it('should print a not authorized message', () => {
                expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.NOT_AUTHORIZED);
            });
        });
    });
    describe('when command is removeadmin', () => {
        beforeEach(() => {
            discordCommand.getCommand = jest.fn().mockReturnValue('removeadmin');
            executeCommand({
                serverQueue, discordCommand,
            });
        });
        it('should call isAuthorized', () => {
            expect(isAuthorized).toHaveBeenCalledWith({ serverQueue, discordCommand });
        });
        describe('when isAuthorized returns true', () => {
            beforeEach(() => {
                isAuthorized.mockReturnValue(true);
                discordCommand.getArgs.mockReturnValue('new role');
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('calls serverQueue.removeAdmin with the serverId and the arguments', () => {
                expect(serverQueue.removeAdmin).toHaveBeenCalledWith('serverId', 'new role');
            });
            describe('when removeAdmin returns true', () => {
                beforeEach(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.removeAdmin.mockReturnValue(true);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('prints a successfully added message', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.ADMIN_REMOVED);
                });
            });
            describe('when removeAdmin returns false', () => {
                beforeEach(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.removeAdmin.mockReturnValue(false);
                    executeCommand({
                        serverQueue, discordCommand,
                    });
                });
                it('prints an already added message', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.ADMIN_NOT_FOUND);
                });
            });
        });
        describe('when isAuthorized returns false', () => {
            beforeEach(() => {
                discordCommand.sendMessage.mockClear();
                isAuthorized.mockReturnValue(false);
                executeCommand({
                    serverQueue, discordCommand,
                });
            });
            it('should print a not authorized message', () => {
                expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.NOT_AUTHORIZED);
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
                    discordCommand.sendMessage.mockClear();
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
            const strings = [messages.DEQUEUE_SUCCESS, messages.DEQUEUE_EMPTY];
            const zipped = cases.map((val, ind) => [val, strings[ind]]);
            describe.each(zipped)('when method returns %p', (value, msg) => {
                beforeEach(() => {
                    discordCommand.sendMessage.mockClear();
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
                    discordCommand.sendMessage.mockClear();
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

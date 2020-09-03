jest.mock('../helpers/run_authorized_command');
const runAuthorizedCommand = require('../helpers/run_authorized_command');
const createroom = require('./createroom');
jest.mock('../helpers/check_args');
const checkArgs = require('../helpers/check_args');
const messages = require('../locale/messages');
jest.mock('../helpers/send_message_with_boolean');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');

describe('COMMAND: create room', () => {
    let discordCommand, serverQueue, client, consoleError;
    beforeAll(() => {
        consoleError = console.error;
        console.error = jest.fn();
    });
    afterAll(() => {
        console.error = consoleError;
    });
    beforeEach(() => {
        checkArgs.mockImplementation(() => {});
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
            getArgs: jest.fn().mockReturnValue('args'),
            getChannelManager: jest.fn().mockReturnValue('channelManager'),
            sendMessage: jest.fn(),
        };
        client = {
            user: 'user',
        };
        serverQueue = {
            createRoom: jest.fn().mockReturnValue('createRoomResult'),
        };
        console.error = jest.fn();
        serverQueue.createRoom.mockImplementation(() =>
            Promise.reject(true),
        );
        discordCommand.getCommand = jest.fn().mockReturnValue('createroom');
        createroom({ discordCommand, serverQueue, client });
    });
    it('should call runAuthorizedCommand', () => {
        expect(runAuthorizedCommand).toHaveBeenCalledWith({
            serverQueue,
            discordCommand,
        }, expect.any(Function));
    });
    describe('runAuthorizedCommand callback', () => {
        let callback;
        beforeEach(() => {
            runAuthorizedCommand.mockClear();
            createroom({ discordCommand, serverQueue, client });
            callback = runAuthorizedCommand.mock.calls[0][1];
            callback();
        });
        it('calls checkArgs', () => {
            expect(checkArgs).toHaveBeenCalledWith(discordCommand);
        });
        describe('when checkArgs returns true', () => {
            beforeEach(() => {
                checkArgs.mockReturnValue(true);
                callback();
            });
            it('calls serverQueue createroom', () => {
                expect(serverQueue.createRoom).toHaveBeenCalledWith(
                    'serverId',
                    'args',
                    'channelManager',
                    'user',
                );
            });
            describe('when promise resolves', () => {
                beforeEach(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.createRoom.mockReturnValue(Promise.resolve('result'));
                    callback();
                });
                it('calls sendMessageWithBoolean with the correct arguments', () => {
                    expect(sendMessageWithBoolean).toHaveBeenCalledWith({
                        result: 'result',
                        discordCommand,
                        trueMessage: messages.ROOM_CREATED,
                        falseMessage: messages.ROOM_NOT_CREATED,
                    });
                });
            });
            describe('when promise rejects', () => {
                beforeEach(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.createRoom.mockReturnValue(Promise.reject('error'));
                    callback();
                });
                it('prints an error to console', () => {
                    expect(console.error).toHaveBeenCalledWith('UNKNOWN ERROR: error');
                });
                it('should send a message saying an error occurred', () => {
                    expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.UNKNOWN_ERROR);
                });
            });
        });
        describe('when checkArgs returns false', () => {
            beforeEach(() => {
                checkArgs.mockReturnValue(false);
                callback();
            });
            it('sends a message saying missing arguments', () => {
                expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.MISSING_ARGS);
            });
        });
    });
});

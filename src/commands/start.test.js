const start = require('./start');
jest.mock('../helpers/run_authorized_command');
const runAuthorizedCommand = require('../helpers/run_authorized_command');
jest.mock('../helpers/run_group_command');
const runGroupCommand = require('../helpers/run_group_command');
jest.mock('../helpers/show_server');
const showServer = require('../helpers/show_server');
jest.mock('../helpers/handle_promise_with_message');
const handlePromiseWithMessage = require('../helpers/handle_promise_with_message');
const messages = require('../locale/messages');

describe('COMMAND: start', () => {
    let discordCommand, serverQueue;
    beforeAll(() => {
        runAuthorizedCommand.mockImplementation(() => {});
        handlePromiseWithMessage.mockImplementation(() => {});
        runGroupCommand.mockImplementation(() => {});
        showServer.mockReturnValue('showServer');
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
            getParentId: jest.fn().mockReturnValue('parentId'),
            getParent: jest.fn().mockReturnValue('parent'),
            sendMessage: jest.fn(),
        };
        serverQueue = {
            initQueue: jest.fn(),
        };
        start({ serverQueue, discordCommand });
    });
    it('calls runAuthorizedCommand', () => {
        expect(runAuthorizedCommand).toHaveBeenCalledWith(
            { serverQueue, discordCommand },
            expect.any(Function),
        );
    });
    describe('runAuthorizedCommand callback', () => {
        beforeAll(() => {
            runAuthorizedCommand.mock.calls[0][1]();
        });
        it('calls runGroupCommand', () => {
            expect(runGroupCommand).toHaveBeenCalledWith({ serverQueue, discordCommand },
                expect.any(Function));
        });
        describe('runGroupCommand callback', () => {
            describe('when initQueue returns true', () => {
                beforeAll(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.initQueue.mockReturnValue(true);
                    runGroupCommand.mock.calls[0][1]();
                });
                it('calls showServer helper with the parent channel', () => {
                    expect(showServer).toHaveBeenCalledWith({
                        parentCategoryServer: 'parent',
                    });
                });
                it('calls handlePromise with the correct arguments', () => {
                    expect(
                        handlePromiseWithMessage,
                    ).toHaveBeenCalledWith({
                        promise: 'showServer',
                        discordCommand,
                        successMessage: messages.OFFICE_HOURS_STARTED,
                        failureMessage: messages.UNKNOWN_ERROR,
                    });
                });
            });
            describe('when initQueue returns false', () => {
                beforeAll(() => {
                    discordCommand.sendMessage.mockClear();
                    serverQueue.initQueue.mockReturnValue(false);
                    runGroupCommand.mock.calls[0][1]();
                });
                it('should send an already started message', () => {
                    expect(
                        discordCommand.sendMessage,
                    ).toHaveBeenCalledWith(
                        messages.OFFICE_HOURS_ALREADY_STARTED,
                    );
                });
            });
        });
    });
});

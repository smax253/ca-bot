const stop = require('./stop');
jest.mock('../helpers/run_authorized_command');
const runAuthorizedCommand = require('../helpers/run_authorized_command');
jest.mock('../helpers/run_group_command');
const runGroupCommand = require('../helpers/run_group_command');
jest.mock('../helpers/hide_server');
const hideServer = require('../helpers/hide_server');
jest.mock('../helpers/handle_promise_with_message');
const handlePromiseWithMessage = require('../helpers/handle_promise_with_message');
jest.mock('../helpers/run_command_if_active');
const runCommandIfActive = require('../helpers/run_command_if_active');

const messages = require('../locale/messages');

describe('COMMAND: stop', () => {
    let discordCommand, serverQueue;
    beforeAll(() => {
        runAuthorizedCommand.mockImplementation(() => {});
        handlePromiseWithMessage.mockImplementation(() => {});
        runGroupCommand.mockImplementation(() => {});
        hideServer.mockReturnValue('hideServer');
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
            getParentId: jest.fn().mockReturnValue('parentId'),
            getParent: jest.fn().mockReturnValue('parent'),
            sendMessage: jest.fn(),
        };
        serverQueue = {
            stopQueue: jest.fn(),
        };
        stop({ serverQueue, discordCommand });
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
            beforeAll(() => {
                runGroupCommand.mock.calls[0][1]();
            });
            it('calls runCommandIfActive helper', () => {
                expect(runCommandIfActive).toHaveBeenCalledWith({ serverQueue, discordCommand },
                    expect.any(Function));
            });
            describe('runCommandIfActive callback', () => {
                describe('when stopQueue returns true', () => {
                    beforeAll(() => {
                        discordCommand.sendMessage.mockClear();
                        serverQueue.stopQueue.mockReturnValue(true);
                        runCommandIfActive.mock.calls[0][1]();
                    });
                    it('calls showServer helper with the parent channel', () => {
                        expect(hideServer).toHaveBeenCalledWith({
                            parentCategoryServer: 'parent',
                        });
                    });
                    it('calls handlePromise with the correct arguments', () => {
                        expect(
                            handlePromiseWithMessage,
                        ).toHaveBeenCalledWith({
                            promise: 'hideServer',
                            discordCommand,
                            successMessage: messages.OFFICE_HOURS_STOPPED,
                            failureMessage: messages.UNKNOWN_ERROR,
                        });
                    });
                });
                describe('when stopQueue returns false', () => {
                    beforeAll(() => {
                        discordCommand.sendMessage.mockClear();
                        serverQueue.stopQueue.mockReturnValue(false);
                        runCommandIfActive.mock.calls[0][1]();
                    });
                    it('should send an already started message', () => {
                        expect(
                            discordCommand.sendMessage,
                        ).toHaveBeenCalledWith(
                            messages.OFFICE_HOURS_NOT_ACTIVE,
                        );
                    });
                });
            });
        });
    });
});

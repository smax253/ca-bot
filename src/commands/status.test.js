const status = require('./status');
jest.mock('../helpers/run_group_command');
const runGroupCommand = require('../helpers/run_group_command');
jest.mock('../helpers/run_command_if_active');
const runCommandIfActive = require('../helpers/run_command_if_active');
jest.mock('../helpers/get_queue_position');
const getQueuePosition = require('../helpers/get_queue_position');
jest.mock('../helpers/send_message_with_boolean');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const parseMessage = require('../helpers/parse_message');
const messages = require('../locale/messages');
describe('COMMAND: status', () => {
    let discordCommand, serverQueue;
    beforeAll(() => {
        getQueuePosition.mockReturnValue('queuePosition');
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
            getParentId: jest.fn().mockReturnValue('parentId'),
            getAuthorId: jest.fn().mockReturnValue('authorId'),
        };
        serverQueue = {
            getQueue: jest.fn().mockReturnValue('serverQueueResult'),
        };
        status({ discordCommand, serverQueue });
    });
    it('calls runGroupCommand', () => {
        expect(runGroupCommand).toHaveBeenCalledWith({ serverQueue, discordCommand }, expect.any(Function));
    });
    describe('runGroupCommand callback', () => {
        beforeAll(() => {
            runGroupCommand.mock.calls[0][1]();
        });
        it('calls runCommandIfActive', () => {
            expect(runCommandIfActive).toHaveBeenCalledWith({ serverQueue, discordCommand }, expect.any(Function));
        });
        describe('runCommandIfActive callback', () => {
            beforeAll(() => {
                runCommandIfActive.mock.calls[0][1]();
            });
            it('calls serverQueue.getQueue with the correct arguments', () => {
                expect(serverQueue.getQueue).toHaveBeenCalledWith('serverId', 'parentId');
            });
            it('calls getQueuePosition helper with the queue and author id', () => {
                expect(getQueuePosition).toHaveBeenCalledWith('serverQueueResult', 'authorId');
            });
            it('calls sendMessageWithBoolean with the correct arguments', () => {
                const subs = {
                    position: 'queuePosition',
                    id: 'authorId',
                };
                expect(sendMessageWithBoolean).toHaveBeenCalledWith({
                    result: 'queuePosition',
                    discordCommand,
                    trueMessage: parseMessage(messages.STATUS_SUCCESS, subs),
                    falseMessage: parseMessage(messages.STATUS_NOT_FOUND, subs),
                });
            });
        });
    });
});

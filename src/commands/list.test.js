const list = require('./list');
jest.mock('../helpers/run_group_command');
const runGroupCommand = require('../helpers/run_group_command');
jest.mock('../helpers/run_command_if_active');
const runCommandIfActive = require('../helpers/run_command_if_active');
jest.mock('../helpers/parse_queue');
const parseQueue = require('../helpers/parse_queue');
jest.mock('../helpers/send_message_with_boolean');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const parseMessage = require('../helpers/parse_message');
const messages = require('../locale/messages');

describe('COMMAND: list', () => {
    let serverQueue, discordCommand;
    beforeAll(() => {
        parseQueue.mockReturnValue('parsedQueue');
        serverQueue = {
            getQueue: jest.fn().mockReturnValue('queue'),
        };
        discordCommand = {
            getServerId: jest.fn().mockReturnValue('serverId'),
            getParentId: jest.fn().mockReturnValue('parentId'),
        };
        list({ serverQueue, discordCommand });
    });
    it('should call runGroupCommand', () => {
        expect(runGroupCommand).toHaveBeenCalledWith({ serverQueue, discordCommand },
            expect.any(Function));
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
            it('calls serverQueue.getQueue', () => {
                expect(serverQueue.getQueue).toHaveBeenCalledWith('serverId', 'parentId');
            });
            it('passes queue into parseQueue', () => {
                expect(parseQueue).toHaveBeenCalledWith('queue');
            });
            it('calls sendMessageWithBoolean with the parsed queue and the correct arguments', () => {
                expect(sendMessageWithBoolean).toHaveBeenCalledWith({
                    result: 'parsedQueue',
                    discordCommand,
                    trueMessage: parseMessage(messages.QUEUE_LIST, {
                        queue: 'parsedQueue',
                    }),
                    falseMessage: messages.QUEUE_EMPTY,
                });
            });
        });
    });
});

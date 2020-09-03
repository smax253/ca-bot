const dequeue = require('./dequeue');
jest.mock('../helpers/run_command_if_active');
const runCommandIfActive = require('../helpers/run_command_if_active');
jest.mock('../helpers/run_group_command');
const runGroupCommand = require('../helpers/run_group_command');
jest.mock('../helpers/send_message_with_boolean');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const messages = require('../locale/messages');
const parseMessage = require('../helpers/parse_message');
jest.mock('../helpers/run_authorized_command');
const runAuthorizedCommand = require('../helpers/run_authorized_command');
describe('COMMAND: dequeue', () => {
    let discordCommand, serverQueue;
    beforeAll(() => {
        discordCommand = {
            getAuthorId: jest.fn().mockReturnValue('authorId'),
            getServerId: jest.fn().mockReturnValue('serverId'),
            getParentId: jest.fn().mockReturnValue('parentId'),
        };
        serverQueue = {
            dequeue: jest.fn().mockReturnValue('dequeueResult'),
        };
        dequeue({ discordCommand, serverQueue });
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
            expect(runGroupCommand).toHaveBeenCalledWith(
                { serverQueue, discordCommand },
                expect.any(Function),
            );
        });
        describe('runGroupCommand callback', () => {
            beforeAll(() => {
                runGroupCommand.mock.calls[0][1]();
            });
            it('calls runCommandIfActive', () => {
                expect(runCommandIfActive).toHaveBeenCalledWith(
                    { serverQueue, discordCommand },
                    expect.any(Function),
                );
            });
            describe('runCommandIfActive callback', () => {
                beforeAll(() => {
                    runCommandIfActive.mock.calls[0][1]();
                });
                it('calls queue with the correct arguments', () => {
                    expect(serverQueue.dequeue).toHaveBeenCalledWith(
                        'serverId',
                        'parentId',
                    );
                });
                it('calls sendMessageWithBoolean with the correct arguments', () => {
                    const subs = {
                        target: 'dequeueResult',
                    };
                    expect(sendMessageWithBoolean).toHaveBeenCalledWith(
                        {
                            result: 'dequeueResult',
                            discordCommand,
                            trueMessage: parseMessage(messages.DEQUEUE_SUCCESS, subs),
                            falseMessage: messages.DEQUEUE_EMPTY,
                        },
                    );
                });
            });
        });
    });

});

jest.mock('../helpers/run_command_if_active');
const runCommandIfActive = require('../helpers/run_command_if_active');
jest.mock('../helpers/run_group_command');
const runGroupCommand = require('../helpers/run_group_command');
jest.mock('../helpers/send_message_with_boolean');
const sendMessageWithBoolean = require('../helpers/send_message_with_boolean');
const messages = require('../locale/messages');
const parseMessage = require('../helpers/parse_message');
const remove = require('./remove');


describe('COMMAND: remove', () => {
    let discordCommand, serverQueue;
    beforeAll(() => {
        discordCommand = {
            getAuthorId: jest.fn().mockReturnValue('authorId'),
            getServerId: jest.fn().mockReturnValue('serverId'),
            getParentId: jest.fn().mockReturnValue('parentId'),
            getMember: jest.fn().mockReturnValue('author'),
        };
        serverQueue = {
            remove: jest.fn().mockReturnValue('removeResult'),
        };
        remove({ discordCommand, serverQueue });
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
            it('calls remove with the correct arguments', () => {
                expect(serverQueue.remove).toHaveBeenCalledWith(
                    'serverId',
                    'parentId',
                    'author',
                );
            });
            it('calls sendMessageWithBoolean with the correct arguments', () => {
                const subs = {
                    id: 'authorId',
                };
                expect(sendMessageWithBoolean).toHaveBeenCalledWith(
                    {
                        result: 'removeResult',
                        discordCommand,
                        trueMessage: parseMessage(messages.REMOVE_SUCCESS, subs),
                        falseMessage: parseMessage(messages.REMOVE_NOT_FOUND, subs),
                    },
                );
            });
        });
    });
});

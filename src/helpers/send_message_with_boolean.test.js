const sendMessageWithBoolean = require('./send_message_with_boolean');

describe('HELPER: send message with boolean', () => {
    let discordCommand, trueMessage, falseMessage;
    beforeEach(() => {
        discordCommand = {
            sendMessage: jest.fn(),
        };
        trueMessage = 'success';
        falseMessage = 'failure';
    });
    describe('when result is truthy', () => {
        beforeEach(() => {
            sendMessageWithBoolean({
                result: true,
                discordCommand,
                trueMessage,
                falseMessage,
            });
        });
        it('calls sendMessage with the true message', () => {
            expect(discordCommand.sendMessage).toHaveBeenCalledWith(trueMessage);
        });
    });
    describe('when result is falsy', () => {
        beforeEach(() => {
            sendMessageWithBoolean({
                result: false,
                discordCommand,
                trueMessage,
                falseMessage,
            });
        });
        it('calls sendMessage with the false message', () => {
            expect(discordCommand.sendMessage).toHaveBeenCalledWith(falseMessage);
        });
    });
});

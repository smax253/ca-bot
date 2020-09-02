const handlePromiseWithMessage = require('./handle_promise_with_message');

describe('HELPER: resolve promise with messages', () => {
    let promise, discordCommand, successMessage, failureMessage, trueConsoleError;
    beforeAll(() => {
        trueConsoleError = console.error;
        console.error = jest.fn();
    });
    afterAll(() => {
        console.error = trueConsoleError;
    });
    beforeEach(() => {
        discordCommand = {
            sendMessage: jest.fn(),
        };
        successMessage = 'success',
        failureMessage = 'failure';
    });
    describe('when promise resolves', () => {
        beforeEach(() => {
            promise = Promise.resolve();
            handlePromiseWithMessage({
                promise,
                discordCommand,
                successMessage,
                failureMessage,
            });
        });
        it('calls discordCommand.sendMessage with the success message', () => {
            expect(discordCommand.sendMessage).toHaveBeenCalledWith(successMessage);
        });
    });
    describe('when promise rejects', () => {
        beforeEach(() => {
            promise = Promise.reject('ERROR');
            handlePromiseWithMessage({
                promise,
                discordCommand,
                successMessage,
                failureMessage,
            });
        });
        it('calls discordCommand.sendMessage with the failure message', () => {
            expect(discordCommand.sendMessage).toHaveBeenCalledWith(failureMessage);
        });
        it('logs error to console.error', () => {
            expect(console.error).toHaveBeenCalledWith('ERROR');
        });
    });
});

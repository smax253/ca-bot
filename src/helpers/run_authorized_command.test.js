const runAuthorizedCommand = require('./run_authorized_command');
jest.mock('./is_authorized');
const isAuthorized = require('./is_authorized');
const messages = require('../locale/messages');

describe('HELPER: run authorized command', () => {
    let serverQueue, discordCommand, command;
    beforeEach(() => {
        serverQueue = 'serverQueue';
        discordCommand = {
            sendMessage: jest.fn(),
        };
        command = jest.fn();
        runAuthorizedCommand({ serverQueue, discordCommand }, command);
    });
    it('calls isAuthorized', () => {
        expect(isAuthorized).toHaveBeenCalledWith({ serverQueue, discordCommand });
    });
    describe('when user is authorized', () => {
        beforeEach(() => {
            command.mockReset();
            isAuthorized.mockReturnValue(true);
            runAuthorizedCommand({ serverQueue, discordCommand }, command);
        });
        it('runs the given command', () => {
            expect(command).toHaveBeenCalled();
        });
    });
    describe('when user is not authorized', () => {
        beforeEach(() => {
            command.mockReset();
            isAuthorized.mockReturnValue(false);
            runAuthorizedCommand({ serverQueue, discordCommand }, command);
        });
        it('does not run the given command', () => {
            expect(command).not.toHaveBeenCalled();
        });
        it('prints a not authorized message', () => {
            expect(discordCommand.sendMessage).toHaveBeenCalledWith(messages.NOT_AUTHORIZED);
        });
    });
});

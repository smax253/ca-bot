const executeCommand = require('./execute_command');
jest.mock('../commands', () => {
    return {
        command: jest.fn(),
    };
});
const commands = require('../commands');

describe('HELPER: executeCommand', () => {
    let serverQueue, discordCommand, client;
    beforeAll(() => {
        serverQueue = 'serverQueue';
        discordCommand = {
            getCommand: jest.fn().mockReturnValue('command'),
        };
        client = 'client';
        executeCommand({ serverQueue, discordCommand, client });
    });
    it('calls the command with all three arguments passed', () => {
        expect(commands.command).toHaveBeenCalledWith({ serverQueue, discordCommand, client });
    });
});

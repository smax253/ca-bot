const help = require('./help');
jest.mock('../helpers/generate_help_command');
const generateHelpCommand = require('../helpers/generate_help_command');

describe('COMMAND: help', () => {
    let discordCommand;
    beforeAll(() => {
        generateHelpCommand.mockReturnValue('generatedHelpMessage');
        discordCommand = {
            sendMessage: jest.fn(),
        };
        help({ discordCommand });
    });
    it('should print the generated help message', () => {
        expect(discordCommand.sendMessage).toHaveBeenCalledWith('generatedHelpMessage');
    });
});

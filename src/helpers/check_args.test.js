const checkArgs = require('./check_args');
describe('HELPER check arguments', () => {
    let discordCommand;
    beforeEach(() => {
        discordCommand = {
            getArgs : jest.fn(),
        };
    });

    describe('When command has args', () => {
        let result;
        beforeEach(() => {
            discordCommand.getArgs.mockReturnValue('args');
            result = checkArgs(discordCommand);
        });
        it('returns true', () => {
            expect(result).toEqual(true);
        });
    });

    describe('When command does not have args', () => {
        let result;
        beforeEach(() => {
            discordCommand.getArgs.mockReturnValue(undefined);
            result = checkArgs(discordCommand);
        });
        it('returns false', () => {
            expect(result).toEqual(false);
        });
    });
});

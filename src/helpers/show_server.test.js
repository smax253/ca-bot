const showServer = require('./show_server');

describe('HELPER: showServer', () => {
    let parent, result;
    beforeEach(() => {
        parent = {
            updateOverwrite: jest.fn(() => 'promise'),
            guild: {
                roles: {
                    everyone: 'everyone',
                },
            },
        };
        result = showServer({ parentCategoryServer: parent });
    });
    it('calls updateOverwrite to show category to everyone', () => {
        expect(parent.updateOverwrite).toHaveBeenCalledWith('everyone', {
            VIEW_CHANNEL: true,
        });
    });
    it('returns the promise', () => {
        expect(result).toEqual('promise');
    });
});

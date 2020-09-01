const hideServer = require('./hide_server');

describe('HELPER: hide category server', () => {
    let parentCategoryServer, result;
    beforeEach(() => {
        parentCategoryServer = {
            updateOverwrite: jest.fn(() => 'promise'),
            guild: {
                roles: {
                    everyone: 'everyone',
                },
            },
        };
        result = hideServer({ parentCategoryServer });
    });
    it('should call updateOverwrite to hide the server', () => {
        expect(parentCategoryServer.updateOverwrite).toHaveBeenCalledWith('everyone', {
            VIEW_CHANNEL: false,
        });
    });
    it('should return the promise', () => {
        expect(result).toEqual('promise');
    });
});

const showServer = require('./show_server');

describe('HELPER: showServer', () => {
    let parent;
    beforeEach(() => {
        parent = {
            overwritePermissions: jest.fn(),
            guild: {
                roles: {
                    everyone: 'everyone',
                },
            },
        };
        showServer({ parentCategoryServer: parent });
    });
    it('calls overwritePermissions to show category to everyone', () => {
        expect(parent.overwritePermissions).toHaveBeenCalledWith([
            {
                id: 'everyone',
                allow: ['VIEW_CHANNEL'],
            },
        ]);
    });
});

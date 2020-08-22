const isAuthorized = require('./is_authorized');

describe('HELPER: isAuthorized', () => {
    let serverQueue, discordCommand, result;
    describe('when user is owner', () => {
        beforeEach(() => {
            serverQueue = {};
            discordCommand = {
                getOwnerId: jest.fn().mockReturnValue('ownerID'),
                getAuthorId: jest.fn().mockReturnValue('ownerID'),
            };
            result = isAuthorized({ serverQueue, discordCommand });
        });
        it('calls getOwnerId and getAuthorId to compare the two IDs', () => {
            expect(discordCommand.getOwnerId).toHaveBeenCalled();
            expect(discordCommand.getAuthorId).toHaveBeenCalled();
        });
        it('returns true', () => {
            expect(result).toEqual(true);
        });
    });
    describe('when user is not the owner', () => {
        beforeEach(() => {
            serverQueue = { isAdmin: jest.fn().mockReturnValue('result') };
            discordCommand = {
                getOwnerId: jest.fn().mockReturnValue('ownerID'),
                getAuthorId: jest.fn().mockReturnValue('otherID'),
                getServerId: jest.fn().mockReturnValue('serverID'),
                getRoles: jest.fn().mockReturnValue('roles'),
            };
            result = isAuthorized({ serverQueue, discordCommand });
        });
        it('calls getRoles and getServerId to get the values', () => {
            expect(discordCommand.getServerId).toHaveBeenCalled();
            expect(discordCommand.getRoles).toHaveBeenCalled();
        });
        it('calls isAdmin with the serverId and roleList', () => {
            expect(serverQueue.isAdmin).toHaveBeenCalledWith('serverID', 'roles');
        });
        it('returns true', () => {
            expect(result).toEqual('result');
        });
    });
});

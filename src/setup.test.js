jest.mock('firebase-admin', () => {
    return {
        initializeApp: jest.fn(),
        credential:{
            cert: jest.fn(),
        },
        firestore: jest.fn(),
    };
});
const admin = require('firebase-admin');

jest.mock('discord.js', () => {
    return {
        Client: jest.fn().mockImplementation(() => {
            return {
                client: 'client',
            };
        }),
    };
});
const discord = require('discord.js');

jest.mock('./discord_message_listener', () => jest.fn());
const discordMessageListener = require('./discord_message_listener');

jest.mock('./entities/server_queue', () => {
    return jest.fn().mockImplementation(() => {
        return {
            queue: 'queue',
        };
    });
});
const ServerQueue = require('./entities/server_queue');

jest.mock('../cloud-perms.json', () => {
    return 'perms';
});

const setup = require('./setup');

describe('setup.js', () => {
    let collectionSpy;
    beforeEach(() => {
        collectionSpy = jest.fn().mockReturnValue('collection');
        admin.firestore.mockReturnValue({ collection: collectionSpy });
        process.env.DISCORD_BOT_KEY = 'discordKey';
        admin.credential.cert.mockReturnValue('cert');
        setup();
    });
    it('should create a new discord client', () => {
        expect(discord.Client).toHaveBeenCalled();
    });
    it('should call admin.initializeApp with credentials', () => {
        expect(admin.credential.cert).toHaveBeenCalledWith('perms');
        expect(admin.initializeApp).toHaveBeenCalledWith({
            credential: 'cert',
        });
    });
    it('should create a db with firestore', () => {
        expect(admin.firestore).toHaveBeenCalled();
    });
    it('should lookup servers collection from db', () => {
        expect(collectionSpy).toHaveBeenCalledWith('servers');
    });
    it('should create a new ServerQueue object', () => {
        expect(ServerQueue).toHaveBeenCalledWith('collection');
    });
    it('should call discordMessageListener with the client', () => {
        expect(discordMessageListener).toHaveBeenCalledWith({
            queue: {
                queue: 'queue',
            },
            client: {
                client: 'client',
            },
            discordKey: 'discordKey',
        });
    });
});

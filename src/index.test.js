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
jest.mock('firebase-admin', () => {
    return {
        initializeApp: jest.fn(),
        credential:{
            cert: jest.fn(),
        },
        firestore: jest.fn(),
    };
});

jest.mock('./discord_message_listener.js', () => jest.fn());
const discordMessageListener = require('./discord_message_listener.js');


jest.mock('../cloud-perms.json', () => {
    return 'perms';
});

const setup = require('./index.js');

describe('index.js', () => {
    beforeEach(() => {
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
    it.skip('should create a db with firestore', () => {
        expect(admin.firestore).toHaveBeenCalled();
    });
    it('should call discordMessageListener with the client', () => {
        expect(discordMessageListener).toHaveBeenCalledWith({
            client: {
                client: 'client',
            },
            discordKey: 'discordKey',
        });
    });
});

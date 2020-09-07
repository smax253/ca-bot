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
const mockDb = {
    collection: jest.fn(() => 'collectionRef'),
};
const mockMongoClient = {
    connect: jest.fn(),
    db: jest.fn(() => mockDb),
};
jest.mock('mongodb', () => {
    return {
        MongoClient: jest.fn(() => mockMongoClient),
    };
});
const mongo = require('mongodb');

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


const setup = require('./setup');

describe('setup.js', () => {
    beforeEach(() => {
        process.env.DISCORD_BOT_KEY = 'discordKey';
        process.env.MONGO_DB_URI = 'mongoKey';
        setup();
    });
    it('should create a new discord client', () => {
        expect(discord.Client).toHaveBeenCalled();
    });
    it('should create a new mongodb client', () => {
        expect(mongo.MongoClient).toHaveBeenCalledWith('mongoKey');
        expect(mockMongoClient.connect).toHaveBeenCalled();
    });
    it('should create a db with mongo client', () => {
        expect(mockMongoClient.db).toHaveBeenCalledWith('servers');
    });
    it('should lookup servers collection from db', () => {
        expect(mockDb.collection).toHaveBeenCalledWith('servers');
    });
    it('should create a new ServerQueue object', () => {
        expect(ServerQueue).toHaveBeenCalledWith('collectionRef');
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

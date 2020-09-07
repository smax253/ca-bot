const discord = require('discord.js');
const { MongoClient } = require('mongodb');
const discordMessageListener = require('./discord_message_listener');
const ServerQueue = require('./entities/server_queue');

const setup = async function() {
    const client = new discord.Client();
    const mongoClient = MongoClient(process.env.MONGO_DB_URI);
    await mongoClient.connect();
    const db = mongoClient.db('servers');
    const collectionref = db.collection('servers');
    const queue = new ServerQueue(collectionref);
    discordMessageListener({ queue, client, discordKey: process.env.DISCORD_BOT_KEY });
};

module.exports = setup;

const admin = require('firebase-admin');
const discord = require('discord.js');
// const firebase = require('firebase');
const discordMessageListener = require('./discord_message_listener.js');
const ServerQueue = require('./entities/server_queue.js');
const serviceAccount = require('../cloud-perms.json');


const setup = () => {
    const client = new discord.Client();
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    const db = admin.firestore();
    const collectionref = db.collection('servers');
    const queue = new ServerQueue(collectionref);
    discordMessageListener({ client, discordKey: process.env.DISCORD_BOT_KEY });

};

setup();

module.exports = setup;

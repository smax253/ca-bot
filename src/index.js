const discord = require('discord.js');
const firebase = require('firebase');
const admin = require('firebase-admin');
const discordMessageListener = require('./discord_message_listener.js');
const serviceAccount = require('../cloud-perms.json');

const setup = () => {
	const client = new discord.Client();
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
	const db = admin.firestore();
	discordMessageListener({ client, discordKey: process.env.DISCORD_BOT_KEY });

};

setup();

module.exports = setup;

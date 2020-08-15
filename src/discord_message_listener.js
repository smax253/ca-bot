const discordMessageListener = ({ client, discordKey }) => {
	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}`);
	});
	client.login(discordKey);
};

module.exports = discordMessageListener;

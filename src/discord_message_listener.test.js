const listener = require('./discord_message_listener.js');

describe('discord_message_listener.js', () => {
	let fakeClient;
	beforeEach(() => {
		fakeClient = {
			on: jest.fn(),
			login: jest.fn(),
			user: {
				tag: 'username',
			},
		};
		const args = {
			client: fakeClient,
			discordKey: 'discordKey',
		};
		jest.spyOn(console, 'log');
		console.log.mockImplementation(() => {});
		listener(args);
	});
	it('should call login with the key', () => {
		expect(fakeClient.login).toHaveBeenCalledWith('discordKey');
	});
	it('should call on with "ready"', () => {
		expect(fakeClient.on).toHaveBeenCalledWith('ready', expect.any(Function));
	});
	describe('on ready callback', () => {
		let readyCallback;
		beforeEach(() => {
			readyCallback = fakeClient.on.mock.calls.find((call) => call[0] === 'ready')[1];
			readyCallback();
		});
		it('should log a message to console', () => {
			expect(console.log).toHaveBeenCalledWith(`Logged in as ${fakeClient.user.tag}`);
		});
	});
});
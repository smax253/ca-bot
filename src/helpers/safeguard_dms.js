const messages = require('../locale/messages');
const safeGuard = (discordCommand) => {
    if(discordCommand.getChannel.type === 'dm') {
        discordCommand.sendDM(messages.DM);
    }
};

module.exports = safeGuard;

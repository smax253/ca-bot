const generateHelpCommand = require('../helpers/generate_help_command');

const help = ({ discordCommand }) => {
    discordCommand.sendMessage(generateHelpCommand());
};
module.exports = help;

const commands = require('../locale/commands');
const parseMessage = require('./parse_message');
const HELP_MESSAGE = require('../locale/help');
const generateHelpCommand = () => {
    const commandsList = {};
    const prefix = commands.prefix;
    Object.keys(commands.commands).forEach((key) => {
        if (!commandsList[commands.commands[key]]) {
            commandsList[commands.commands[key]] = [prefix + key];
        }
        else {
            commandsList[commands.commands[key]].push(prefix + key);
        }
    });
    return parseMessage(HELP_MESSAGE, commandsList);
};

module.exports = generateHelpCommand;

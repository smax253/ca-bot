const parseMessage = (message, substitutions) => {
    let parsedMessage = message;
    Object.keys(substitutions).forEach((key) => {
        const subString = '[' + key + ']';
        if (message.indexOf(subString) > 0) {
            parsedMessage = parsedMessage.replace(
                subString,
                substitutions[key],
            );
        }
    });
    return parsedMessage;
};

module.exports = parseMessage;

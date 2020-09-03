const commands = {
    addadmin: require('./addadmin'),
    createroom: require('./createroom'),
    dequeue: require('./dequeue'),
    help: require('./help'),
    init: require('./init'),
    queue: require('./queue'),
    remove: require('./remove'),
    removeadmin: require('./removeadmin'),
    start: require('./start'),
    stop: require('./stop'),
};

module.exports = commands;

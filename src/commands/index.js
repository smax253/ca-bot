const commands = {
    addadmin: require('./addadmin'),
    createroom: require('./createroom'),
    dequeue: require('./dequeue'),
    help: require('./help'),
    init: require('./init'),
    list: require('./list'),
    queue: require('./queue'),
    remove: require('./remove'),
    removeadmin: require('./removeadmin'),
    start: require('./start'),
    status: require('./status'),
    stop: require('./stop'),
};

module.exports = commands;

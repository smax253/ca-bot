const getQueuePosition = (queue, authorId) => {
    return 1 + queue.findIndex((entry) => entry.id === authorId);
};

module.exports = getQueuePosition;

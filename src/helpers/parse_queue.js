const parseQueue = (queue) => {
    if (queue.length === 0) return '';
    return queue.map(member => member.displayName)
        .reduce((prev, next, ind) => prev.concat(`${ind + 1}. ${next}\n`), '')
        .slice(0, -1);
};
module.exports = parseQueue;

const parseQueue = require('./parse_queue');

describe('HELPER: parse queue', () => {
    let result;
    describe('when queue is empty', () => {
        beforeEach(() => {
            result = parseQueue([]);
        });
        it('returns an empty string', () => {
            expect(result).toEqual('');
        });
    });
    describe('when queue is not empty', () => {
        beforeEach(() => {
            const queue = [
                {
                    displayName: 'name1',
                },
                {
                    displayName: 'name2',
                },
                {
                    displayName: 'name3',
                },
            ];
            result = parseQueue(queue);
        });
        it('should return a numbered list of the queue', () => {
            expect(result).toEqual(
                '1. name1\n2. name2\n3. name3');
        });
    });
});

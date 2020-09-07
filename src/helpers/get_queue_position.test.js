const getQueuePosition = require('./get_queue_position');

describe('HELPER: get queue position', () => {
    let queue, result;
    beforeEach(() => {
        queue = [
            {
                id: 'user1',
            },
            {
                id: 'user2',
            },
            {
                id: 'user3',
            },
        ];
    });
    describe('when user is in queue', () => {
        beforeEach(() => {
            result = getQueuePosition(queue, 'user2');
        });
        it('should return the correct queue position, indexed by 1', () => {
            expect(result).toEqual(2);
        });
    });
    describe('when user is not in queue', () => {
        beforeEach(() => {
            result = getQueuePosition(queue, 'user4');
        });
        it('should return 0', () => {
            expect(result).toEqual(0);
        });
    });
});

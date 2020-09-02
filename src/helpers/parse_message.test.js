const parseMessage = require('./parse_message');

describe('HELPER: Parse message with arguments', () => {
    let message, subs, result;
    beforeEach(() => {
        message = 'substitution example with [substitution]';
        subs = {
            substitution: 'replacement',
            unused: 'unused',
        };
        result = parseMessage(message, subs);
    });
    it('should replace the bracketed portion with the substitution', () => {
        expect(result).toEqual('substitution example with replacement');
    });
});

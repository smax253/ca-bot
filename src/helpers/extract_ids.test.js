const extractIds = require('./extract_ids');

describe('HELPER: extract IDs from child channels', () => {
    let result;
    beforeEach(() => {
        const childChannels = [
            {
                id: 'categoryId',
            },
            {
                id: 'textId',
            },
            {
                id: 'botTextId',
            },
            {
                id: 'privateChannelId',
            },
            {
                id: 'publicChannelId',
            },
        ];
        result = extractIds(childChannels);
    });
    it('returns an object associating all channels with their ids', () => {
        expect(result).toEqual({
            id: 'categoryId',
            text_channel_id: 'textId',
            bot_text_channel_id: 'botTextId',
            private_channel_id: 'privateChannelId',
            public_channel_id: 'publicChannelId',
        });
    });
});

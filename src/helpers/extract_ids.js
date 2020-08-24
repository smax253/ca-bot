const extractIds = (channels) => {
    const result = {};
    const labels = ['id', 'text_channel_id', 'bot_text_channel_id', 'private_channel_id', 'public_channel_id'];
    labels.forEach((elem, ind) => {
        result[elem] = channels[ind].id;
    });
    return result;
};
module.exports = extractIds;

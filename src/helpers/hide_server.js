const hideServer = ({
    parentCategoryServer,
}) => {
    return parentCategoryServer.updateOverwrite(parentCategoryServer.guild.roles.everyone, {
        'VIEW_CHANNEL': false,
    });
};
module.exports = hideServer;

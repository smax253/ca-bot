const showServer = ({
    parentCategoryServer,
}) => {
    return parentCategoryServer.updateOverwrite(parentCategoryServer.guild.roles.everyone, {
        'VIEW_CHANNEL': true,
    });
};
module.exports = showServer;

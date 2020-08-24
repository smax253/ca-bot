const showServer = ({
    parentCategoryServer,
}) => {
    parentCategoryServer.overwritePermissions([
        {
            id: parentCategoryServer.guild.roles.everyone,
            allow: ['VIEW_CHANNEL'],
        },
    ]);
};
module.exports = showServer;

const blank_server = require('../constants/blank_server');
const getDocDataWithId = require('../helpers/get_document_data_with_id');
const matchStudentIds = require('../helpers/match_student_ids');
const extractIds = require('../helpers/extract_ids');
const createChildChannels = require('../helpers/create_child_channels');
const createCategoryChannel = require('../helpers/create_category_channel');

class ServerQueue {
    constructor(collectionRef) {
        this.collectionRef = collectionRef;
        this.servers = {};
        this.getData();
    }

    getData() {
        getDocDataWithId({ collectionRef: this.collectionRef, serverQueue: this });
    }

    syncData(serverId) {
        const server = this.servers[serverId];
        this.collectionRef.doc(serverId).set({
            groups: server.groups,
            admin_roles: server.admin_roles,
        });
    }

    updateData(data) {
        const servers = this.servers;
        data.map(server => {
            if(!servers[server.id]) {
                servers[server.id] = {
                    ...server.data,
                    queue: [],
                };
            }
            else{
                servers[server.id].admin_roles = server.data.admin_roles;
                servers[server.id].groups = server.data.groups;
            }
        });
    }

    initServer(serverId) {
        if(this.servers[serverId]) {
            return false;
        }
        this.collectionRef.doc(serverId).set(blank_server);
        this.getData();
        return true;
    }

    queue(serverId, groupId, student) {
        const groups = this.servers[serverId].groups;
        const queue = groups.find(group => group.id === groupId).queue;

        if (queue.find(matchStudentIds(student))) {
            return false;
        }
        else{
            queue.push(student);
            return true;
        }
    }

    dequeue(serverId, groupId) {
        const groups = this.servers[serverId].groups;
        const queue = groups.find(group => group.id === groupId).queue;

        if(queue.length === 0) return null;
        else return queue.shift();
    }

    remove(serverId, groupId, student) {
        const groups = this.servers[serverId].groups;
        const queue = groups.find(group => group.id === groupId).queue;

        const ind = queue.findIndex(matchStudentIds(student));
        if (ind < 0) {
            return false;
        }
        else{
            queue.splice(ind, 1);
            return true;
        }
    }
    isAdmin(serverId, roleList) {
        const server = this.servers[serverId];
        const is_admin = server.admin_roles.map((role) => roleList.includes(role)).includes(true);
        return is_admin;
    }
    addAdmin(serverId, role) {
        const server = this.servers[serverId];
        if (server.admin_roles.includes(role)) return false;
        server.admin_roles.push(role);
        this.syncData(serverId);
        return true;
    }
    removeAdmin(serverId, role) {
        const server = this.servers[serverId];
        const ind = server.admin_roles.indexOf(role);
        if (ind < 0) {
            return false;
        }
        else{
            server.admin_roles.splice(ind, 1);
            this.syncData(serverId);
            return true;
        }
    }
    isGroup(serverId, groupId) {
        const groups = this.servers[serverId].groups;
        return groups.map(group => group.id).includes(groupId);
    }
    initQueue(serverId, groupId) {
        const groups = this.servers[serverId].groups;
        const targetGroup = groups.find(group => group.id === groupId);
        if (targetGroup.queue) return false;
        targetGroup.queue = [];
        return true;
    }
    createRoom(serverId, roomName, channelManager, selfRole) {
        return createCategoryChannel({
            roomName, selfRole, channelManager,
            everyoneRole: channelManager.guild.roles.everyone,
        }).then(categoryChannel => {
            const channels = [categoryChannel];
            channels.push(...createChildChannels({
                channelManager, roomName, selfRole,
                parent: categoryChannel,
            }));
            return Promise.all(channels);
        }).then(childChannels => {
            const groups = this.servers[serverId].groups;
            groups.push(extractIds(childChannels));
            this.syncData(serverId);
            return true;
        }).catch(error => {
            console.error('Error in createRoom(): '.concat(error));
            return false;
        });
    }
    isActive(serverId, groupId) {
        const group = this.servers[serverId].groups.find(office => office.id === groupId);
        return !!group.queue;
    }
}

module.exports = ServerQueue;

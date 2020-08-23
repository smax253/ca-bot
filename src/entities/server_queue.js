const blank_server = require('../constants/blank_server');
const getDocDataWithId = require('../helpers/get_document_data_with_id');
const matchStudentIds = require('../helpers/match_student_ids');

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

    queue(serverId, student) {
        const queue = this.servers[serverId].queue;
        if (queue.find(matchStudentIds(student))) {
            return false;
        }
        else{
            queue.push(student);
            return true;
        }
    }

    dequeue(serverId) {
        const queue = this.servers[serverId].queue;
        if(queue.length === 0) return null;
        else return queue.shift();
    }

    remove(serverId, student) {
        const queue = this.servers[serverId].queue;
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
    createRoom(serverId, roomName, channelManager, selfRole) {
        return channelManager.create(roomName, {
            type: 'category',
            permissionOverwrites: [
                {
                    id: channelManager.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: selfRole,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
        }).then(categoryChannel => {
            const channels = [categoryChannel];
            channels.push(channelManager.create('no-mic', {
                topic: 'General text chat for '.concat(roomName),
                parent: categoryChannel,
                permissionOverwrites: [
                    {
                        id: selfRole,
                        deny: ['VIEW_CHANNEL'],
                    },
                ],
            }));
            channels.push(channelManager.create('bot-commands', {
                topic: 'Bot commands for '.concat(roomName),
                parent: categoryChannel,
            }));
            channels.push(channelManager.create('1-on-1', {
                type: 'voice',
                parent: categoryChannel,
                userLimit: 2,
            }));
            channels.push(channelManager.create('Office', {
                type: 'voice',
                parent: categoryChannel,
            }));
            return Promise.all(channels);
        }).then(childChannels => {
            const labels = ['id', 'text_channel_id', 'bot_text_channel_id', 'private_channel_id', 'public_channel_id'];
            const groups = this.servers[serverId].groups;
            const newGroup = {};
            labels.forEach((elem, ind) => {
                newGroup[elem] = childChannels[ind].id;
            });
            groups.push(newGroup);
            this.syncData(serverId);
            return true;
        }).catch(error => {
            console.error('Error in createRoom(): '.concat(error));
            return false;
        });
    }
}

module.exports = ServerQueue;

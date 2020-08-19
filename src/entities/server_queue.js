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
}

module.exports = ServerQueue;

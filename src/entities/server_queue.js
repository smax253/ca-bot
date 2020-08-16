const blank_server = require('../constants/blank_server');
const getDocDataWithId = require('../helpers/get_document_data_with_id');

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
}

module.exports = ServerQueue;

const BlankServer = require('../constants/blank_server');
jest.mock('../helpers/get_document_data_with_id');
const getDocDataWithIdMock = require('../helpers/get_document_data_with_id');
const ServerQueue = require('./server_queue');

describe('ENTITY: ServerQueue', () => {
    let instance, collectionRef, setSpy;
    beforeEach(() => {
        getDocDataWithIdMock.mockImplementation(() => {});
        setSpy = jest.fn();
        jest.spyOn(ServerQueue.prototype, 'getData');
        jest.spyOn(ServerQueue.prototype, 'syncData');
        collectionRef = {
            doc: jest.fn().mockReturnValue({
                set: setSpy,
            }),
        };
        instance = new ServerQueue(collectionRef);
    });
    describe('constructor', () => {
        it('should call getData', () => {
            expect(ServerQueue.prototype.getData).toHaveBeenCalled();
        });
        it('sets instance fields', () => {
            expect(instance.collectionRef).toEqual(collectionRef);
            expect(instance.servers).toEqual({});
        });
    });
    describe('getData()', () => {
        beforeEach(() => {
            instance.getData();
        });
        it('calls getDocDataWithId with collectionRef and itself', () => {
            expect(getDocDataWithIdMock).toHaveBeenCalledWith({
                collectionRef: collectionRef,
                serverQueue: instance,
            });
        });
    });
    describe('updateData', () => {
        beforeEach(() => {
            instance.servers = {
                serverId1: {
                    queue: ['queue1', 'queue2'],
                    admin_roles: ['admin1', 'admin2'],
                    groups: {
                        private: 'private',
                    },
                },
            };
            instance.updateData([
                {
                    id: 'serverId1',
                    data: {
                        admin_roles: ['admin1'],
                        groups: {
                            private: 'newPrivate',
                        },
                    },
                },
            ]);
        });
        it('updates admin_roles', () => {
            expect(instance.servers.serverId1.admin_roles).toEqual(['admin1']);
        });
        it('updates groups', () => {
            expect(instance.servers.serverId1.groups).toEqual({
                private: 'newPrivate',
            });
        });
        describe('there is data of existing servers', () => {
            it('does NOT update queue', () => {
                expect(instance.servers.serverId1.queue).toEqual(['queue1', 'queue2']);
            });
        });
        describe('there is data of new servers', () => {
            beforeEach(() => {
                instance.updateData([
                    {
                        id: 'serverId2',
                        data: {
                            admin_roles: [],
                            groups: {
                                private: 'new server private',
                                public: 'new public channel',
                            },
                        },
                    },
                ]);
            });
            it('creates new empty queue', () => {
                expect(instance.servers.serverId2.queue).toEqual([]);
            });
        });
    });

    describe('methods called with commands', () => {
        beforeEach(() => {
            instance.servers = {
                serverId1: {
                    queue: ['queue1', 'queue2'],
                    admin_roles: ['admin1', 'admin2'],
                    groups: [
                        {
                            private: 'private',
                        },
                    ],
                },
            };
        });
        describe('syncData()', () => {
            beforeEach(() => {
                collectionRef.doc.mockClear();
                setSpy.mockClear();
                instance.servers.serverId1.admin_roles = ['newadminrole'];
                instance.servers.serverId1.groups = {
                    private: 'newPrivate',
                };
                instance.syncData('serverId1');
            });
            it('calls collectionRef.doc with the serverId', () => {
                expect(collectionRef.doc).toHaveBeenCalledWith('serverId1');
            });
            it('sets admin roles and groups in the document', () => {
                expect(setSpy).toHaveBeenCalledWith({
                    admin_roles: instance.servers.serverId1.admin_roles,
                    groups: instance.servers.serverId1.groups,
                });
            });
        });
        describe('initServer()', () => {
            describe('when the server already exists', () => {
                beforeEach(() => {
                    instance.servers = {
                        serverId1: {},
                    };
                });
                it('should return false', () => {
                    expect(instance.initServer('serverId1')).toEqual(false);
                });
            });
            describe('when the server does not exist', () => {
                let result;
                beforeEach(() => {
                    instance.servers = {};
                    result = instance.initServer('serverId1');
                });
                it('should create a new document with the server name', () => {
                    expect(collectionRef.doc).toHaveBeenCalledWith('serverId1');
                });
                it('should set the value of the document to a blank server initialization document', () => {
                    expect(setSpy).toHaveBeenCalledWith(BlankServer);
                });
                it('should call getData', () => {
                    expect(ServerQueue.prototype.getData).toHaveBeenCalled();
                });
                it('should return true', () => {
                    expect(result).toEqual(true);
                });
            });
        });
        describe('isAdmin()', () => {
            let result;
            describe('when the role list does not have one of the roles in the admin list', () => {
                beforeEach(() => {
                    result = instance.isAdmin('serverId1', ['role1', 'role2', 'role3']);
                });
                it('should return false', () => {
                    expect(result).toEqual(false);
                });
            });
            describe('when the role list has one of hte roles in the admin list', () => {
                beforeEach(() => {
                    result = instance.isAdmin('serverId1', ['role1', 'admin1', 'role3']);
                });
                it('should return true', () => {
                    expect(result).toEqual(true);
                });
            });
        });
        describe('addAdmin()', () => {
            let result;
            describe('when role is not an admin', () => {
                beforeEach(() => {
                    instance.syncData.mockClear();
                    result = instance.addAdmin('serverId1', 'admin3');
                });
                it('adds the role to the list of admins', () => {
                    expect(instance.servers.serverId1.admin_roles.includes('admin3')).toEqual(true);
                });
                it('calls syncData with the serverId', () => {
                    expect(instance.syncData).toHaveBeenCalledWith('serverId1');
                });
                it('returns true', () => {
                    expect(result).toEqual(true);
                });
            });
            describe('when role is already an admin', () => {
                beforeEach(() => {
                    result = instance.addAdmin('serverId1', 'admin1');
                });
                it('does not change the list of admins', () => {
                    expect(instance.servers.serverId1.admin_roles).toEqual(['admin1', 'admin2']);
                });
                it('returns false', () => {
                    expect(result).toEqual(false);
                });
            });
        });
        describe('removeAdmin()', () => {
            let result;
            describe('when role is an admin', () => {
                beforeEach(() => {
                    instance.syncData.mockClear();
                    result = instance.removeAdmin('serverId1', 'admin1');
                });
                it('removes the role from the list of admins', () => {
                    expect(instance.servers.serverId1.admin_roles.includes('admin1')).toEqual(false);
                });
                it('calls syncData with the serverId', () => {
                    expect(instance.syncData).toHaveBeenCalledWith('serverId1');
                });
                it('returns true', () => {
                    expect(result).toEqual(true);
                });
            });
            describe('when role is not an admin', () => {
                beforeEach(() => {
                    result = instance.removeAdmin('serverId1', 'admin3');
                });
                it('does not change the list of admins', () => {
                    expect(instance.servers.serverId1.admin_roles).toEqual(['admin1', 'admin2']);
                });
                it('returns false', () => {
                    expect(result).toEqual(false);
                });
            });
        });
        describe('createRoom()', () => {
            let result, channelManager;
            beforeEach(() => {
                instance.syncData.mockClear();
                channelManager = {
                    create: jest.fn(),
                    guild: {
                        roles: {
                            everyone: 'everyone',
                        },
                    },
                };
            });
            describe('when the room does not exist', () => {
                let category, publicVoice, publicText, botText, privateVoice, channels;
                beforeEach(() => {
                    channelManager.create.mockImplementation(() => Promise.reject('not defined'));
                    category = {
                        id: 'categoryid',
                    };
                    publicText = {
                        id: 'publicText',
                    },
                    publicVoice = {
                        id: 'publicVoice',
                    };
                    botText = {
                        id: 'botText',
                    };
                    privateVoice = {
                        id: 'privateVoice',
                    };
                    channels = [category, publicText, botText, privateVoice, publicVoice];
                });
                describe('when channels get created successfully', () => {
                    beforeEach(() => {
                        channels.forEach((channel) => channelManager.create.mockImplementationOnce(() => {
                            return Promise.resolve(channel);
                        }));
                        const selfRole = 'self';
                        result = instance.createRoom('serverId1', 'New CA Room', channelManager, selfRole);
                    });
                    it('should create a new category using the channel manager', () => {
                        expect(channelManager.create).toHaveBeenCalledWith('New CA Room', {
                            type: 'category',
                            permissionOverwrites: [
                                {
                                    id: 'everyone',
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: 'self',
                                    allow: ['VIEW_CHANNEL'],
                                },
                            ],
                        });
                    });
                    it('should create a public text channel', () => {
                        expect(channelManager.create).toHaveBeenCalledWith('no-mic', {
                            topic: 'General text chat for New CA Room',
                            parent: category,
                            permissionOverwrites: [
                                {
                                    id: 'self',
                                    deny: ['VIEW_CHANNEL'],
                                },
                            ],
                        });

                    });
                    it('should create a channel for bot commands', () => {
                        expect(channelManager.create).toHaveBeenCalledWith('bot-commands', {
                            topic: 'Bot commands for New CA Room',
                            parent: category,
                        });
                    });
                    it('should create a voice channel with max 2 members', () => {
                        expect(channelManager.create).toHaveBeenCalledWith('1-on-1', {
                            type: 'voice',
                            parent: category,
                            userLimit: 2,
                        });
                    });
                    it('should create a voice channel with no limit on members', () => {
                        expect(channelManager.create).toHaveBeenCalledWith('Office', {
                            type: 'voice',
                            parent: category,
                        });
                    });
                    it('should update the instance.servers with the new server IDs', () => {
                        expect(instance.servers.serverId1.groups).toContainEqual({
                            bot_text_channel_id: 'botText',
                            id: 'categoryid',
                            private_channel_id: 'privateVoice',
                            public_channel_id: 'publicVoice',
                            text_channel_id: 'publicText',
                        });
                    });
                    it('should call syncData with the serverId', () => {
                        expect(instance.syncData).toHaveBeenCalledWith('serverId1');
                    });
                    it('should return promise that resolves to true', () => {
                        expect.assertions(1);
                        return expect(result).resolves.toEqual(true);
                    });
                });
                describe('when channels fail to get created', () => {
                    beforeEach(() => {
                        console.error = jest.fn();
                        channelManager.create.mockImplementation(() => {
                            return new Promise((_, reject) => {
                                reject('error');
                            });
                        });
                        result = instance.createRoom('serverId1', 'New CA Room', channelManager);
                    });
                    it('should print the error to console.error', () => {
                        expect(console.error).toHaveBeenCalledWith('Error in createRoom(): ' + 'error');
                    });
                    it('should return a promise that resolves to false', () => {
                        expect.assertions(1);
                        return expect(result).resolves.toEqual(false);
                    });
                });
            });
        });
        describe('queue related operations', () => {
            beforeEach(() => {
                instance.servers = {
                    serverId1: {
                        queue:
                        [
                            {
                                id:'student1',
                            },
                            {
                                id: 'student2',
                            },
                        ],
                    },
                };
            });
            describe('queue()', () => {
                describe('when student is already in queue', () => {
                    let result;
                    beforeEach(() => {
                        result = instance.queue('serverId1', { id:'student1' });
                    });
                    it('should not modify the queue', () => {
                        expect(instance.servers).toEqual({
                            serverId1: {
                                queue: [
                                    {
                                        id:'student1',
                                    },
                                    {
                                        id: 'student2',
                                    },
                                ],
                            },
                        });
                    });
                    it('should return false', () => {
                        expect(result).toEqual(false);
                    });
                });
                describe('when student is not in queue', () => {
                    let result;
                    beforeEach(() => {
                        result = instance.queue('serverId1', { id:'student3' });
                    });
                    it('should put the student in the back of the queue', () => {
                        expect(instance.servers).toEqual({
                            serverId1: {
                                queue: [
                                    {
                                        id:'student1',
                                    },
                                    {
                                        id: 'student2',
                                    },
                                    { id:'student3' },
                                ],
                            },
                        });
                    });
                    it('should return true', () => {
                        expect(result).toEqual(true);
                    });
                });
            });
            describe('dequeue()', () => {
                describe('when there is a student in queue', () => {
                    let result;
                    beforeEach(() => {
                        result = instance.dequeue('serverId1');
                    });
                    it('should removes from the front of the queue', () => {
                        expect(instance.servers).toEqual({
                            serverId1: {
                                queue: [{
                                    id: 'student2',
                                }],
                            },
                        });
                    });
                    it('should return the dequeued student', () => {
                        expect(result).toEqual({
                            id:'student1',
                        });
                    });
                });
                describe('when there are no students in queue', () => {
                    let result;
                    beforeEach(() => {
                        instance.servers = {
                            serverId1: {
                                queue: [],
                            },
                        };
                        result = instance.dequeue('serverId1');
                    });
                    it('does not modify the queue', () => {
                        expect(instance.servers).toEqual({
                            serverId1: {
                                queue: [],
                            },
                        });
                    });
                    it('should return null', () => {
                        expect(result).toEqual(null);
                    });
                });
            });
            describe('remove()', () => {
                describe('when the student is not in queue', () => {
                    let result;
                    beforeEach(() => {
                        result = instance.remove('serverId1', { id:'student3' });
                    });
                    it('does not modify the queue', () => {
                        expect(instance.servers).toEqual({
                            serverId1: {
                                queue: [{
                                    id:'student1',
                                },
                                {
                                    id: 'student2',
                                }],
                            },
                        });
                    });
                    it('should return true', () => {
                        expect(result).toEqual(false);
                    });
                });
                describe('when the student is in queue', () => {
                    let result;
                    beforeEach(() => {
                        result = instance.remove('serverId1', { id:'student2' });
                    });
                    it('removes the student from the queue', () => {
                        expect(instance.servers).toEqual({
                            serverId1: {
                                queue: [{
                                    id:'student1',
                                }],
                            },
                        });
                    });
                    it('should return true', () => {
                        expect(result).toEqual(true);
                    });
                });
            });
        });
    });
});

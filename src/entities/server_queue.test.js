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
                instance.servers = {};
                instance.updateData([
                    {
                        id: 'serverId1',
                        data: {
                            admin_roles: ['admin1'],
                            groups: {
                                private: 'newprivate',
                            },
                        },
                    },
                ]);
            });
            it('creates new empty queue', () => {
                expect(instance.servers.serverId1.queue).toEqual([]);
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

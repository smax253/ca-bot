const getDocDataWithId = require('./get_document_data_with_id');

describe('HELPER: get Document Data with ID', () => {
    let collectionRef, serverQueue, allDocumentsRef;
    beforeEach(() => {
        allDocumentsRef = {
            toArray: jest.fn(),
        };
        collectionRef = {
            find: jest.fn(() => allDocumentsRef),
        };
        serverQueue = {
            updateData: jest.fn(),
        };
    });
    describe('on Promise success', () => {
        beforeEach(() => {
            allDocumentsRef.toArray.mockReturnValue(
                new Promise((resolve) => {
                    resolve([
                        {
                            _id: 'id1',
                            data: 'data1',
                        },
                        {
                            _id: 'id2',
                            data: 'data2',
                        },
                    ]);
                }),
            );
            getDocDataWithId({ collectionRef, serverQueue });
        });
        it('should call serverQueue.updateData with the data', () => {
            expect(serverQueue.updateData).toHaveBeenCalledWith([
                {
                    id: 'id1',
                    data: {
                        _id: 'id1',
                        data: 'data1',
                    },
                },
                {
                    id: 'id2',
                    data: {
                        _id: 'id2',
                        data: 'data2',
                    },
                },
            ]);
        });
    });
    describe('on Promise failure', () => {
        beforeEach(() => {
            console.error = jest.fn();
            allDocumentsRef.toArray.mockReturnValue(
                new Promise((_, reject) => {
                    reject('error');
                }),
            );
            getDocDataWithId({ collectionRef, serverQueue });
        });
        it('should call console.error with the error', () => {
            expect(console.error).toHaveBeenCalledWith('error');
        });
    });
});

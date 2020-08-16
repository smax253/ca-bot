const getDocumentDataWithId = require('./get_document_data_with_id');
const getDocDataWithId = require('./get_document_data_with_id');

describe('HELPER: get Document Data with ID', () => {
    let collectionRef, serverQueue;
    beforeEach(() => {
        collectionRef = {
            listDocuments: jest.fn(),
        };
        serverQueue = {
            updateData: jest.fn(),
        };
    });
    describe('on Promise success', () => {
        beforeEach(() => {
            collectionRef.listDocuments.mockReturnValue(
                new Promise((resolve) => {
                    resolve([
                        {
                            get: jest.fn().mockReturnValue(
                                {
                                    id: 'id1',
                                    data: jest.fn().mockReturnValue('data1'),
                                }),
                        },
                        {
                            get: jest.fn().mockReturnValue(
                                {
                                    id: 'id2',
                                    data: jest.fn().mockReturnValue('data2'),
                                }),
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
                    data: 'data1',
                },
                {
                    id: 'id2',
                    data: 'data2',
                },
            ]);
        });
    });
    describe('on Promise failure', () => {

    });
});

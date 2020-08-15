const getDocDataWithId = ({ collectionRef, serverQueue }) => {
    collectionRef.listDocuments().then((documentList) => {
        return Promise.all(documentList.map((documentRef) => documentRef.get()));
    }).then(docSnapshots => {
        const data = docSnapshots.map(doc => {
            return {
                id: doc.id,
                data: doc.data(),
            };
        });
        serverQueue.updateData(data);
    }).catch((reason)=> {
        console.error(reason);
    });
};
module.exports = getDocDataWithId;

const getDocDataWithId = ({ collectionRef, serverQueue }) => {
    collectionRef.find().toArray().then(docSnapshots => {
        const data = docSnapshots.map(doc => {
            return {
                id: doc._id,
                data: doc,
            };
        });
        serverQueue.updateData(data);
    }).catch((reason)=> {
        console.error(reason);
    });
};
module.exports = getDocDataWithId;

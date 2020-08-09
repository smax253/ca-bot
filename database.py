from google.cloud import firestore
from dotenv import load_dotenv

load_dotenv()

db = firestore.Client()
collection_ref: firestore.CollectionReference = db.collection(u'servers')
documents = list(collection_ref.list_documents())
doc_ids = list(map(lambda x: x.id, documents))
doc_data = list(map(lambda x: x.get().to_dict(), documents))


def update_snapshot():
    global documents, doc_ids, doc_data
    documents = list(collection_ref.list_documents())
    doc_ids = list(map(lambda x: x.id, documents))
    doc_data = list(map(lambda x: x.get().to_dict(), documents))


def update_doc_data():
    global doc_data
    doc_data = list(map(lambda x: x.get().to_dict(), documents))


def contains(doc_id):
    return str(doc_id) in doc_ids


def get_doc_data_by_id(doc_id):
    if not contains(doc_id):
        return None
    return documents[doc_ids.index(str(doc_id))].get().to_dict()


def create_document(doc_id):
    if contains(doc_id):
        raise NameError("Server already initialized")
    collection_ref.add({
        'admin_roles': [],
        'groups': []
    }, document_id=str(doc_id))
    update_snapshot()



def update_data(doc_id, data):
    if not contains(doc_id):
        raise NotADirectoryError("Document id does not exist")
    documents[doc_ids.index(str(doc_id))].update(data)
    update_doc_data()


if __name__ == '__main__':
    print(get_doc_data_by_id("samplediscordid"))
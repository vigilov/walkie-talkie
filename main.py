import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import threading

cred_path = "walkie-talkie-limassol-firebase-adminsdk-hvxbi-663355e2dc.json"
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

'''
// Database schema:
{
  "chats": [{
      "id": "123123",
      "topic": "",
      "firstMessage": "",
      "responser": "",
      "createdAt": "",
      "createdBy": "",
      "status": "panding|open|resolved",
      "summary": ""
  }],
  "messages": [{
      "id": "",
      "chatID": "",
      "text": "",
      "createdAt": "",
      "createdBy": ""
  }],
  "users": [{
      "id": "",
      "role": "",
      "keywords": [""],
      "tacos": 1,
      "devices": [""],
      "bio": ""
  }]
}
'''


# Create an Event for notifying main thread.
callback_done = threading.Event()

# Create a callback on_snapshot function to capture changes
def on_snapshot(col_snapshot, changes, read_time):
    for doc in col_snapshot:
        print(doc.id, doc.to_dict())


# Watch the collection query
query_watch = firestore.client().collection('chats').where('status', '==', 'pending').on_snapshot(on_snapshot)

callback_done.wait()

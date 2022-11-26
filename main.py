#!/usr/bin/env python3

import sentence_transformers
import firebase_admin
import firebase_admin.credentials
import firebase_admin.firestore
import logging
import signal

logging.root.setLevel(logging.INFO)

cred_path = "walkie-talkie-limassol-firebase-adminsdk-hvxbi-663355e2dc.json"
cred = firebase_admin.credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
collection_chats = firebase_admin.firestore.client().collection('chats')
logging.info(f"{cred_path} registered")

sentence_model = sentence_transformers.SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
logging.info("SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2') loaded")

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
      "unMatchedParticipants": [],  // "users".[]."id"
      "status": "pending|open|resolved|close",
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


# Create a callback on_snapshot function to capture changes
def on_snapshot(col_snapshot, changes, read_time):
    logging.info(f"on_snapshot(col_snapshot) called, len(col_snapshot) == {len(col_snapshot)}")
    batch = firebase_admin.firestore.client().batch()

    # Load all resolved chats
    resolved_chats = collection_chats.where('status', '==', 'resolved').get()
    # Calculate a embedding for each
    precalculated_chats = []
    for resolved_chat in resolved_chats:
        first_message = resolved_chat.get('firstMessage')
        first_message_tensor = sentence_model.encode(first_message, convert_to_tensor=True)
        precalculated_chats.append((first_message_tensor, resolved_chat))

    for pending_chat in col_snapshot:
        first_message = pending_chat.get('firstMessage')
        # Calculate a embedding for each chat with 1 member
        first_message_tensor = sentence_model.encode(first_message, convert_to_tensor=True)
        # Find the most relevant one
        chats_by_relevance = sorted([(
            sentence_transformers.util.pytorch_cos_sim(first_message_tensor, resolved_tensor),
            resolved_chat
        ) for resolved_tensor, resolved_chat in precalculated_chats],
            key=lambda x: float(x[0][0][0])  # x be like pytorch.tensor([[0.42]])
        )

        # Set up the most relevant expert who has not yet tried to answer this question
        for score, relevant_chat in chats_by_relevance:
            if responder := relevant_chat.get("responser") in pending_chat.get("unMatchedParticipants"):
                continue
            batch.update(collection_chats.document(pending_chat.id), {'status': 'open', 'responder': responder})
            logging.info(f"pending chat {pending_chat.id} matched with chat {relevant_chat}, score == {score}")

    batch.commit()
    logging.info("on_snapshot -> batch.commit(), new matches saved")
    return


# Watch the collection query
pending_chats = collection_chats.where('status', '==', 'pending')
query_watch = pending_chats.on_snapshot(on_snapshot)
logging.info('"on_snapshot" handler registered, application ready')

# Run in background until SIGINT
signal.signal(signal.SIGINT, lambda sig, frame: exit(0))
signal.pause()

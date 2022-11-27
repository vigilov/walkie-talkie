#!/usr/bin/env python3

import sentence_transformers
import firebase_admin
import firebase_admin.credentials
import logging
from firebase_admin import firestore
import signal
import operator
import uuid
from datetime import datetime


logging.root.setLevel(logging.INFO)

cred_path = "walkie-talkie-limassol-firebase-adminsdk-hvxbi-663355e2dc.json"
cred = firebase_admin.credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

collection_users = db.collection('users')
collection_chats = db.collection('chats')
collection_messages = db.collection('messages')
logging.info(f"{cred_path} registered")

# Change to https://huggingface.co/sentence-transformers/multi-qa-MiniLM-L6-cos-v1 ?
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
    # logging.info(f"on_snapshot(col_snapshot) called, len(col_snapshot) == {len(col_snapshot)}")
    batch = firebase_admin.firestore.client().batch()

    precalculated_users = list()
    # Load all resolved chats
    # resolved_chats = collection_chats.where('status', '==', 'resolved').get()
    # for resolved_chat in resolved_chats:
    #     first_message = resolved_chat.get('firstMessage')
    #     first_message_tensor = sentence_model.encode(first_message, convert_to_tensor=True)
    #     precalculated_users.append((first_message_tensor, resolved_chat))

    business_users = collection_users.where('roles', 'array_contains', 'business').get()
    for user in business_users:
        bio = user.get("bio")
        if bio != "":
            bio_tensor = sentence_model.encode(bio, convert_to_tensor=True)
            precalculated_users.append({"tensor": bio_tensor, "user": user.to_dict(), "multiplier": 1.2})

    expert_users = collection_users.where('roles', 'array_contains', 'expert').get()
    for user in expert_users:
        bio = user.get("bio")
        if bio != "":
            bio_tensor = sentence_model.encode(bio, convert_to_tensor=True)
            precalculated_users.append({"tensor": bio_tensor, "user": user.to_dict(), "multiplier": 1.1})

    precalculated_chats = []
    resolved_chats = collection_chats.where('summary', '!=', '').get()
    for chat in resolved_chats:
        chat_tensor = sentence_model.encode(chat.to_dict()['summary'], convert_to_tensor=True)
        precalculated_chats.append({"tensor": chat_tensor, "chat": chat.to_dict()})

    for pending_chat in col_snapshot:

        first_message = pending_chat.get('firstMessage')
        # Calculate embedding for each chat with 1 member
        first_message_tensor = sentence_model.encode(first_message, convert_to_tensor=True)
        # Find the most relevant one

        if len(precalculated_chats) > 0:
            rated_chats = []
            for chat in precalculated_chats:
                if chat["chat"]["id"] in pending_chat.get("unMatchedSummarizedChats"):
                    continue
                rate = sentence_transformers.util.pytorch_cos_sim(first_message_tensor, chat["tensor"])
                rated_chats.append({"chat": chat["chat"], "rate": float(rate)})
            rated_chats.sort(key=operator.itemgetter('rate'), reverse=True)
            if len(rated_chats) > 0:
                if float(rated_chats[0]["rate"]) > 0.5:
                    collection_messages.document(str(uuid.uuid4())).set({
                        "chatID": pending_chat.get("id"),
                        "text": rated_chats[0]["chat"]['summary'],
                        "timestamp": str(datetime.now().isoformat())
                    })
                    batch.update(collection_chats.document(pending_chat.id),
                                    {'status': 'found', "summarizedChatId": chat["chat"]["id"]})
                    continue

        rated_users = []
        for user in precalculated_users:
            rate = sentence_transformers.util.pytorch_cos_sim(first_message_tensor, user["tensor"])
            rated_users.append({"user": user["user"], "rate": float(rate) * user["multiplier"]})

        rated_users.sort(key=operator.itemgetter('rate'))
        # Set up the most relevant expert who has not yet tried to answer this question
        for user in rated_users:
            if user["user"]["id"] in pending_chat.get("unMatchedParticipants"):
                continue
            elif user["user"]["id"] == pending_chat.get("createdBy"):
                continue
            batch.update(collection_chats.document(pending_chat.id), {'status': 'opened', 'responser': user["user"]})
            logging.info(f"pending chat {pending_chat.id}"
                         f" matched with user {user['user']['id']}, score == {user['rate']}")

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

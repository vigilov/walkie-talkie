FROM python:3.10

RUN pip install --upgrade pip && \
    pip install firebase_admin sentence-transformers;

RUN python3 -c '__import__("sentence_transformers").SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")';

WORKDIR /src

COPY main.py walkie-talkie-limassol-firebase-adminsdk-hvxbi-663355e2dc.json /src/

CMD ["/usr/local/bin/python3", "/src/main.py"]

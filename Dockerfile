FROM python:3.10

RUN pip install --upgrade pip && \
    pip install firebase_admin sentence-transformers;

WORKDIR /src

COPY main.py walkie-talkie-limassol-firebase-adminsdk-hvxbi-663355e2dc.json /src/

CMD ["/src/main.py"]

import json
import os
import pymongo
from pymongo import MongoClient

TFIDF_DATA_DIR = "/home/kubic/TIBigdataMiddleware/tfidfs"

files = os.listdir(TFIDF_DATA_DIR)

for file in files:
    with open(os.path.join(TFIDF_DATA_DIR, file),'r', encoding="utf-8") as fp:
        try:
            print("open: " + str(file))
            content = fp.read()
            tfidfData = json.loads(content)
            client = MongoClient('localhost',27017)
            db = client.analysis
            collection = db.tfidfs
            collection.insert_many(tfidfData)
        except TypeError:
            pass
        

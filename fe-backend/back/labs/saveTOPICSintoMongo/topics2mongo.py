import json
import os
import pymongo
from pymongo import MongoClient

TFIDF_DATA_DIR = "/home/kubic/topics.json"

print("reading data...")
dataAll = [json.loads(line) for line in open(TFIDF_DATA_DIR, 'r')]

client = MongoClient('localhost',27017)
db = client.analysis
collection = db.topics
i = 0
for data in dataAll:
    data['topic']
    inputJson = { "topic" : data['topic'], "docTitle" : data['doc_title'], "hashKey" : data['hash_key']}
    collection.insert(inputJson)

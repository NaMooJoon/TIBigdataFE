import json
import os
import pymongo
from pymongo import MongoClient

TFIDF_DATA_DIR = "../data/topics.json"

print("reading data...")
dataAll = [json.loads(line) for line in open(TFIDF_DATA_DIR, 'r')]

client = MongoClient('localhost',27017)
db = client.analysis
collection = db.topics
i = 0
for data in dataAll:
    data['topic']
    inputJson = { "topic" : data['topic'], "docTitle" : data['doc_title'], "docId" : data['doc_id']}
    collection.insert(inputJson)

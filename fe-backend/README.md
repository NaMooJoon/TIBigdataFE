## How to run server
after turn on mongo server in anyway depending on your environment,
```
node server
```

## how to create search history data in your server
after turn on mongo server in anyway depending on your environment,
and update TIBmiddleware upto latest version.
Then in labs/createUserHstSamples, run getSamples.js.
```
node getSamples.js
```

## use mongo terminal
* type
```
mongo
```



## how to create index
```
db.histories.createIndex({keyword: -1})
db.users.createIndex({email : -1 })
db.rcmds.createIndex({docID : -1})
db.tfidfs.createIndex({docID : -1})

```
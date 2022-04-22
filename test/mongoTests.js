const { Collection, Db } = require('mongodb');

var dbClient = require('mongodb').MongoClient;

var dbName = "testMongoFromNode";
var collectionName = "customers";
var url = `mongodb://172.16.16.65:27017/${dbName}`;
var db = null;

dbClient.connect(url, function(err, _db) {
    if (err) {_db.close();throw err;}
    db = _db.db();
    //console.log("Database created!");
    /*
    db.db().createCollection(collectionName, function(err, res) {
        if (err) {db.close();throw err;}
        console.log("Collection created!");

        var myobj = { name: "Apple inc", address: "Cupertino" };
        
        res.insertOne(myobj, (err, res)=>{
            if (err) {db.close();throw err;}
            console.log("1 document inserted");
            db.close();
        });

      });
      
    */
    
   // db.close();

  });

/**
 * 
 * @param {Db} database
 * @param {string} collectionName 
 * @returns {Collection}
 */
function getOrCreateCollection(database, collectionName){
    //database.
}




/**
 * 
 * @param {import('mongodb').Document} object 
 * @param {Collection} mongoCollection 
 * @returns {Promise}
 */
function insertOneAsync(object, mongoCollection) {
    return mongoCollection.insertOne(object);
}

/**
 * 
 * @param {import('mongodb').Document} object 
 * @param {Collection} mongoCollection 
 * @returns {boolean}
 */
function insertOneSync(object, mongoCollection) {
    insertOneAsync(object, mongoCollection)
        .then(res=>{})
        .catch(err=>{});
}

var p = new Promise(res => {
    res()
});
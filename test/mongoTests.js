const { Collection, Db, MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

var dbName = "testMongoFromNode";
var collectionName = "customers";
var url = `mongodb://${process.env.HOSTNAME}:27017/${dbName}`;
let d = '✅';

/** @type {MongoClient} */
var dbClient = new MongoClient(url);
/** @type {Db} */
var db = null;


process.on('exit', ()=>{
    console.log(`Exit event intercepted...`);
    if(!!dbClient && !!dbClient.topology && !!dbClient.topology.isConnected()){
        dbClient.close(()=>{});
        console.log(`Database connection closed ${d}`);
    }
});


async function startTest(){

    try {
        //connection to DB
        
        await dbClient.connect();

        db = dbClient.db();


        //Iterate collections
        /** @type {Collection[]} */
        let c = await db.collections();

        c.forEach((itm)=>{
            console.log("collection name: "+itm.collectionName);
        });


        //Insert new

        /** @type {Collection} */
        let custColl = db.collection(collectionName);

        var myobj = { name: "Def", address: "Munich", street: "Fulp road"};

        let resInserted = await custColl.insertOne(myobj);

        let id = resInserted.insertedId;

        console.log(`the id of the new entity is: ${id}`)

        

        //Find
        let query = { "_id": id};
        
        let resultFind = await custColl.find(query).toArray();
        myobj = resultFind[0];

        console.log(`the id of the entity: ${myobj._id}`);
        console.log(`the name of the entity finded: ${myobj.name}`);


        //Update
        let newVal = {$set: {street: "Eram road"}};
        let resUpdate = await custColl.updateOne(query, newVal);

        console.log(`the result row modified: ${resUpdate.modifiedCount}`);
        
        resultFind = await custColl.find(query).toArray();
        myobj = resultFind[0];

        console.log(`the id of the entity: ${myobj._id}`);
        console.log(`the streed modified: ${myobj.street}`);

        //Replace
        myobj.name = 'Imer';
        delete myobj._id;
        let resReplace = await custColl.replaceOne(query, myobj);
        
        console.log(`the replace result row are: ${resReplace.modifiedCount}`);

        resultFind = await custColl.find(query).toArray();
        myobj = resultFind[0];

        console.log(`the name modified: ${myobj.name}`);
        
        //Delete
        let resDelete = await custColl.deleteOne(query);

        console.log(`the deleted row are: ${resDelete.deletedCount}`);

        resultFind = await custColl.find(query).toArray();

        console.log(`the result row find are: ${resultFind.length}`);
        
        let d = 0;

    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        process.exit();
    }
}

startTest();

/*
dbClient.connect(function(err, _db) {
    if (err) {_db.close();throw err;}
    db = _db.db();

    db.collections().then(coll=>{
        
        /** @type {Collection[]} */
        /*
        let c = coll;

        c.forEach((itm)=>{
            console.log("collection name: "+itm.collectionName());
        });
        
    });

    /** @type {Collection} *//*
    let custColl = db.collection(collectionName);

    var myobj = { name: "Apple inc", address: "Cupertino" };
    myobj = insertOneSync(myobj, custColl);

    /** @type {Collection} *//*
    let wrongtColl = db.collection('wrongColle');

    

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
/*
  });
*/

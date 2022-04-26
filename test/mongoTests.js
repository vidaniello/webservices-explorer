const { Collection, Db, MongoClient } = require('mongodb');



var dbName = "testMongoFromNode";
var collectionName = "customers";
var url = `mongodb://172.16.16.65:27017/${dbName}`;
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

        var myobj = { name: "Apple inc", address: "Cupertino" };

        myobj = await custColl.insertOne(myobj);

    } catch (err) {
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

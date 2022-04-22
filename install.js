#!/usr/bin/env node

const prompt = require('prompt');
//const util = require('util');
//const readline = require('readline');
//const rl = readline.createInterface({
    //input: process.stdin,
    //output: process.stdout
//});
//let question1 = util.promisify(rl.question).bind(rl);
//let question2 = util.promisify(rl.question).bind(rl);
/*
const common = require('./common');

console.log("INSTALL SCRIPT: Check dirs...");
common.checkAndCreateDirs();
*/


/** @type {string} */
//let envContent = "# .env file generated with install script on "+new Date()+"\n";
/** @type {string} */
//let defHttpPort =   common.config.defaultHttpPort;
/** @type {string} */
//let defMongoHost =  common.config.defaultMongoHostname;
/** @type {string} */
//let defMongoPort =  common.config.defaultMongoPort;

/** @type {string} */
let defHttpPort = '3030';


//console.log("INSTALL SCRIPT: answer questions, clean for default values...");

/*
async function allQuestions(){

    
    try{
        let httpPort = await question1(`Wath is the http server port? (default ${defHttpPort})`);
        if(httpPort!=='')
            defHttpPort = httpPort;
    } catch (err){ }

    try{
        let mongoHost = await question2(`Wath is the MongoDb hostname? (default ${defMongoHost})`);
        if(mongoHost!=='')
            defMongoHost = mongoHost;
    } catch (err){ }

    try{
        let mongoPort = await question(`Wath is the MongoDb port? (default ${defMongoPort})`);
        if(mongoPort!=='')
            defMongoPort = mongoPort;
    } catch (err){ }
    
    rl.close();
}
allQuestions();
*/
prompt.message = 'Ah';
var schema = {
    properties: {
      name: {
        description: "Enter the name",
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true
      },
      password: {
        hidden: true,
        replace: '*',
        required: true,
        message: 'Password must be letters',
      }
    }
  };


  prompt.start();

  prompt.get(schema, function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  name: ' + result.name);
    console.log('  password: ' + result.password);
  });

/*
for(let arg of process.argv){
    if(arg.includes("="))
        envContent += arg+"\n";
}
*/

//console.log("INSTALL SCRIPT: Write .env file...");
//common.cleanAndWriteEnvFile(envContent);


//console.log("INSTALL SCRIPT: Setup end.");
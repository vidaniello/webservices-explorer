#!/usr/bin/env node

const prompt = require('prompt');
const common = require('./common');
prompt.message = `${common.config.promptInstallName}`;

/** @type {string} */
let envContent = ``;

let promptSchema = {
    properties: {
      httpPort: {
        description: `Wath is the http server port? `,
        type: 'integer',
        //pattern: /^[a-zA-Z\s\-]+$/,
        default: `${common.config.defaultHttpPort}`,
        //message: 'Name must be only letters, spaces, or dashes',
        //required: true
      },
      mongoHost: {
        description: `Wath is the MongoDb hostname? `,
        type: 'string',
        //pattern: /^[a-zA-Z\s\-]+$/,
        default: `${common.config.defaultMongoHostname}`,
        //message: 'Name must be only letters, spaces, or dashes',
        //required: true
      },
      mongoPort: {
        description: `Wath is the MongoDb port? `,
        type: 'integer',
        //pattern: /^[a-zA-Z\s\-]+$/,
        default: `${common.config.defaultMongoPort}`,
        //message: 'Name must be only letters, spaces, or dashes',
        //required: true
      },
      mongoUsername: {
        description: `Wath is the MongoDb username? (default is empty)`,
        type: 'string',
        //pattern: /^[a-zA-Z\s\-]+$/,
        default: ``,
        //message: 'Name must be only letters, spaces, or dashes',
        //required: true
      },
      mongoPassword: {
        description: `Wath is the MongoDb password? (default is empty)`,
        hidden: true,
        replace: '*',
        default: ``,
        //required: true,
      }
    }
  };

function promptCallback(result){

  console.log('Command-line input received:');
  console.log('  httpPort:      ' + result.httpPort);
  console.log('  mongoHost:     ' + result.mongoHost);
  console.log('  mongoPort:     ' + result.mongoPort);
  console.log('  mongoUsername: ' + result.mongoUsername);
  console.log('  mongoPassword: ' + '****');

  if(result.httpPort!=''){
    envContent += `${common.config.httpPort_ENV_NAME}=${result.httpPort}\n`;
  }
  
  if(result.mongoHost!=''){
    envContent += `${common.config.dbHostname_ENV_NAME}=${result.mongoHost}\n`;
  }

  if(result.mongoPort!=''){
    envContent += `${common.config.dbPort_ENV_NAME}=${result.mongoPort}\n`;
  }

  if(result.mongoUsername!=''){
    envContent += `${common.config.dbUsername_ENV_NAME}=${result.mongoUsername}\n`;
  }

  if(result.mongoPassword!=''){
    envContent += `${common.config.dbPassword_ENV_NAME}=${result.mongoPassword}\n`;
  }
};

async function startInstallation(){
  try{
    console.log("INSTALL SCRIPT: Check dirs...");
    common.checkAndCreateDirs();

    prompt.start();

    console.log("INSTALL SCRIPT: answer questions, clean for default values...");
    let result = await prompt.get(promptSchema);
    envContent = `# .env file generated with install script on ${new Date()}\n`;
    promptCallback(result);
    console.log("INSTALL SCRIPT: Write .env file...");
    common.cleanAndWriteEnvFile(envContent);
    console.log("INSTALL SCRIPT: Setup ended.");

  } catch (err){
    throw err;
  }
}

startInstallation();



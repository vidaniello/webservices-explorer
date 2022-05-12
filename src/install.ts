#!/usr/bin/env node

import prom from 'prompt';
import {Util} from './util';


class Install{

    static promptSchema: any = {
        properties: {
          httpPort: {
            description: `Wath is the http server port? `,
            type: 'integer',
            //pattern: /^[a-zA-Z\s\-]+$/,
            default: `${Util.conf.defaultHttpPort}`,
            //message: 'Name must be only letters, spaces, or dashes',
            //required: true
          },
          mongoHost: {
            description: `Wath is the MongoDb hostname? `,
            type: 'string',
            //pattern: /^[a-zA-Z\s\-]+$/,
            default: `${Util.conf.defaultMongoHostname}`,
            //message: 'Name must be only letters, spaces, or dashes',
            //required: true
          },
          mongoPort: {
            description: `Wath is the MongoDb port? `,
            type: 'integer',
            //pattern: /^[a-zA-Z\s\-]+$/,
            default: `${Util.conf.defaultMongoPort}`,
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

    public static async start(){
        try{

            let envContent = '';

            console.log("INSTALL SCRIPT: Check dirs...");
            Util.checkAndCreateDirs();

            prom.start({message: Util.conf.promptInstallName});

            console.log("INSTALL SCRIPT: answer questions, clean for default values...");
            let result = await prom.get(Install.promptSchema);

            envContent = `# .env file generated with install script on ${new Date()}\n`;
            envContent = Install.promptcallback(result, envContent);
            console.log("INSTALL SCRIPT: Write .env file...");
            Util.cleanAndWriteEnvFile(envContent);
            console.log("INSTALL SCRIPT: Setup ended.");

        }catch(err){
            console.error(err);
            throw err;
        }
    }

    static promptcallback(result: prom.Properties, envContent: string): string{

        console.log('Command-line input received:');
        console.log('  httpPort:      ' + result.httpPort);
        console.log('  mongoHost:     ' + result.mongoHost);
        console.log('  mongoPort:     ' + result.mongoPort);
        console.log('  mongoUsername: ' + result.mongoUsername);
        console.log('  mongoPassword: ' + '****');

        if(result.httpPort!=''){
            envContent += `${Util.conf.httpPort_ENV_NAME}=${result.httpPort}\n`;
          }
          
          if(result.mongoHost!=''){
            envContent += `${Util.conf.dbHostname_ENV_NAME}=${result.mongoHost}\n`;
          }
        
          if(result.mongoPort!=''){
            envContent += `${Util.conf.dbPort_ENV_NAME}=${result.mongoPort}\n`;
          }
        
          if(result.mongoUsername!=''){
            envContent += `${Util.conf.dbUsername_ENV_NAME}=${result.mongoUsername}\n`;
          }
        
          if(result.mongoPassword!=''){
            envContent += `${Util.conf.dbPassword_ENV_NAME}=${result.mongoPassword}\n`;
          }

          return envContent;
        
    }
    

}
Install.start();
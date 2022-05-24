import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as dotenv from 'dotenv';
import configJson from './configs/webservices-explorer-config.json';


export class Util {

    public static conf = configJson;

    public static getBasePath(){
        return `${os.homedir()}${path.sep}.${Util.conf.workdirName}`;
    }

    public static getDataDirPath(){
        return `${Util.getBasePath()}${path.sep}data`;
    }

    public static getDotEnvFilePath(){
        return `${Util.getBasePath()}${path.sep}.env`;
    }

    /**
     * Check if the dir '{home dir}/{package.name}' and '{home dir}/{package.name}/data' exist and create it if not.
     */
    public static checkAndCreateDirs(){
        console.log(`INFO check of ${Util.getBasePath()} dir`);
        if(!fs.existsSync(Util.getBasePath())){
            fs.mkdirSync(Util.getBasePath());
            console.log(`INFO dir ${Util.getBasePath()} created`);
        }else{
            console.log(`INFO dir ${Util.getBasePath()} exist`);
        }
    
        console.log(`INFO check of ${Util.getDataDirPath()} dir`);
        if(!fs.existsSync(Util.getDataDirPath())){
            fs.mkdirSync(Util.getDataDirPath());
            console.log(`INFO dir ${Util.getDataDirPath()} created`);
        }else{
            console.log(`INFO dir ${Util.getDataDirPath()} exist`);
        }
    }

    /**
     * Check if '{home dir}/{package.name}/.env' file exist and delete if. Then, foreach commandline arg
     * write in '{home dir}/{package.name}/.env' file.
     * @param content 
     */
    public static cleanAndWriteEnvFile(content: string){
    
        if(fs.existsSync(Util.getDotEnvFilePath()))
            fs.rmSync(Util.getDotEnvFilePath());
        
        fs.writeFileSync(`${Util.getDotEnvFilePath()}`, content);
        
    }

    /**
     * Init function
     */
     public static init(){

        //Loading of .env file
        if(fs.existsSync(Util.getDotEnvFilePath()))
            dotenv.config({ path: Util.getDotEnvFilePath() });
        else 
            dotenv.config();
            
        Util.checkAndCreateDirs();
    }

    public static getHttpListenPort(){
        let ret = this.conf.defaultHttpPort;
        if(process.env[this.conf.httpPort_ENV_NAME]!==undefined)
            if(process.env[this.conf.httpPort_ENV_NAME]!==null)
                if(process.env[this.conf.httpPort_ENV_NAME]!=='')
                    ret = process.env[this.conf.httpPort_ENV_NAME];
        return ret;
    }

    public static getMongoDbHostname(){
        let ret = this.conf.defaultMongoHostname;
        if(process.env[this.conf.dbHostname_ENV_NAME]!==undefined)
            if(process.env[this.conf.dbHostname_ENV_NAME]!==null)
                if(process.env[this.conf.dbHostname_ENV_NAME]!=='')
                    ret = process.env[this.conf.dbHostname_ENV_NAME];
        return ret;
    }

    public static getMongoDbPort(){
        let ret = this.conf.defaultMongoPort;
        if(process.env[this.conf.dbPort_ENV_NAME]!==undefined)
            if(process.env[this.conf.dbPort_ENV_NAME]!==null)
                if(process.env[this.conf.dbPort_ENV_NAME]!=='')
                    ret = process.env[this.conf.dbPort_ENV_NAME];
        return ret;
    }

    public static getMongoDbUsername(){
        let ret = '';
        if(process.env[this.conf.dbUsername_ENV_NAME]!==undefined)
            if(process.env[this.conf.dbUsername_ENV_NAME]!==null)
                if(process.env[this.conf.dbUsername_ENV_NAME]!=='')
                    ret = process.env[this.conf.dbUsername_ENV_NAME];
        return ret;
    }

    public static getMongoDbPassword(){
        let ret = '';
        if(process.env[this.conf.dbPassword_ENV_NAME]!==undefined)
            if(process.env[this.conf.dbPassword_ENV_NAME]!==null)
                if(process.env[this.conf.dbPassword_ENV_NAME]!=='')
                    ret = process.env[this.conf.dbPassword_ENV_NAME];
        return ret;
    }

    public static getMongoDbDatabase(){
        return this.conf.databaseName;
    }
}
//export default Util;

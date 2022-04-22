const dotenv = require('dotenv');
const fs = require('fs');
const os = require('os');
const path = require('path')
const config = require('./webservices-explorer-config.json');
module.exports.config = config;
const package = require('./package.json');

/**@returns {string} */
function getBasePath(){
    return `${os.homedir()}${path.sep}.${config.workdirName}`;
}

/**@returns {string} */
function getDataDirPath(){
    return `${getBasePath()}${path.sep}data`;
}

/**@returns {string} */
function getDotEnvFilePath(){
    return `${getBasePath()}${path.sep}.env`;
}

/** @returns {string} */
function getVersion(){
    return package.version;
}
module.exports.getVersion = getVersion;

/**
 * Check if the dir '{home dir}/{package.name}' and '{home dir}/{package.name}/data' exist and create it if not.
 */
function checkAndCreateDirs(){
    console.log(`INFO check of ${getBasePath()} dir`);
    if(!fs.existsSync(getBasePath())){
        fs.mkdirSync(getBasePath());
        console.log(`INFO dir ${getBasePath()} created`);
    }else{
        console.log(`INFO dir ${getBasePath()} exist`);
    }

    console.log(`INFO check of ${getDataDirPath()} dir`);
    if(!fs.existsSync(getDataDirPath())){
        fs.mkdirSync(getDataDirPath());
        console.log(`INFO dir ${getDataDirPath()} created`);
    }else{
        console.log(`INFO dir ${getDataDirPath()} exist`);
    }
}
module.exports.checkAndCreateDirs = checkAndCreateDirs;

/**
 * Check if '{home dir}/{package.name}/.env' file exist and delete if. Then, foreach commandline arg
 * write in '{home dir}/{package.name}/.env' file.
 * 
 *  @param {string} content 
 */
function cleanAndWriteEnvFile(content){
    
    if(fs.existsSync(getDotEnvFilePath()))
        fs.rmSync(getDotEnvFilePath());
    
    fs.writeFileSync(`${getDotEnvFilePath()}`, content);
    
}
module.exports.cleanAndWriteEnvFile = cleanAndWriteEnvFile;


/**
 * Init function
 */
 function init(){

    //Loading of .env file
    if(fs.existsSync(getDotEnvFilePath()))
        dotenv.config({ path: getDotEnvFilePath() });
    else 
        dotenv.config();
        
    checkAndCreateDirs();
}
module.exports.init = init;

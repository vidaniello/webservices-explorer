import {Mongoose, connect, ConnectionStates} from 'mongoose';
import {Util} from './util';
import { Alias, AliasModel, Service, ServiceModel} from './entities/entities';

/**
 * Persistence contetex to mongo DB.
 */
export class Persistence{

    static db: Mongoose;

    public static async init(){

        let strConnection = 'mongodb://';

        if(Util.getMongoDbUsername()!==''){
            strConnection += Util.getMongoDbUsername() + ':';
            strConnection += Util.getMongoDbPassword() + '@';
        }

        strConnection += Util.getMongoDbHostname() + ':';
        strConnection += Util.getMongoDbPort() + '/';
        strConnection += Util.getMongoDbDatabase();

        this.db = await connect (strConnection);

        process.on('exit', Persistence.onExit);

        console.log('MongoDB connection successful!');
    }

    static async onExit(){
        console.log('MongoDB request disconnecting...');
        await Persistence.db.disconnect();
    }

    public static getConnectionState(){
       return Persistence.db.connection.readyState+' ('+ConnectionStates[Persistence.db.connection.readyState]+')';
    }

    public static async addNewService(_newService: Service): Promise<Service>{
        let newService = new ServiceModel(_newService);
        let toret = await newService.save();
        return toret.toObject();
    }

    public static async getService(endpointName: string): Promise<Service>{
        let service = await ServiceModel.findById(endpointName).populate('aliases');
        return service.toObject();
    }

    public static async addNewAlias(_newAlias: Alias): Promise<Alias>{
        let newAlias = new AliasModel(_newAlias);
        let toret = await newAlias.save();
        return toret.toObject();
    }

    public static async getAlias(aliasName: string): Promise<Alias>{
        let alias = await AliasModel.findById(aliasName);
        return alias.toObject();
    }
}
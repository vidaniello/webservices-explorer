import {Mongoose, connect, ConnectionStates} from 'mongoose';
import {Util} from './util';
import { Alias, AliasModel, Service, ServiceModel, serviceParent, serviceNameAliases, ObjectType, ObjectTypeModel} from './entities/entities';

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

    public static async getService(serviceName: string): Promise<Service>{
        let service = await ServiceModel.findById(serviceName).populate(serviceNameAliases);
        if(service!==null)
            return service.toObject();
        else
            throw new Error(`service with name '${serviceName}' not exsist!`);
    }

    public static async addNewAliasAndAssociateToService(_newAlias: Alias, serviceName: string): Promise<Alias>{
        let findedService = await ServiceModel.findById(serviceName);

        if(findedService==null)
            throw new Error(`service with name '${serviceName}' not exsist!`);

        _newAlias.serviceParent = findedService;
        let newAlias = await Persistence.addNewAlias(_newAlias);

        findedService.serviceNameAliases.push(newAlias);

        findedService.save();

        newAlias = AliasModel.findById(newAlias._id).populate(serviceParent);
        return newAlias;
    }




    public static async addNewAlias(_newAlias: Alias): Promise<Alias>{
        let newAlias = new AliasModel(_newAlias);
        let toret = await newAlias.save();
        return toret.toObject();
    }

    public static async getAlias(aliasName: string): Promise<Alias>{
        let alias = await AliasModel.findById(aliasName).populate(serviceParent);
        if(alias!==null)
            return alias.toObject();
        else
            throw new Error(`alias with name '${aliasName}' not exsist!`);
    }





    public static async addNewType(_newType: ObjectType): Promise<ObjectType>{
        let newType = new ObjectTypeModel(_newType);
        let toret = await newType.save();
        return toret.toObject();
    }

    public static async getType(typeName: string): Promise<ObjectType>{
        let obType = await ObjectTypeModel.findById(typeName);
        if(obType!==null)
            return obType.toObject();
        else
            throw new Error(`type with name '${typeName}' not exsist!`);
    }



   
    public static async getEndpoints(serviceName: string): Promise<string[]>;
    public static async getEndpoints(serviceName: string, environment?: string): Promise<string[]>{
        if(environment!==undefined){

        }else{

        }

        return null
    }

}
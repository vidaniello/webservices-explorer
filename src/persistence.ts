import {Mongoose, connect, ConnectionStates} from 'mongoose';
import {Util} from './util';
import {Alias, AliasModel, Service, ServiceModel, serviceParent, serviceNameAliases, ObjectType, ObjectTypeModel, Endpoint} from './entities/entities';

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
        
        let serv: Service = await ServiceModel.findById(_newAlias.aliasName);

        if(serv!=null)
            throw new Error(`Error, there is a service  named '${_newAlias.aliasName}' with same name.`);

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


    /**
     * Cache for services, remember in case of deletion or modification of the Services, clean it.
     */
    static cacheServices = new Map<string, Service>();
   
    public static async getEndpointsURL(serviceName: string, environment?: string): Promise<string[]>{

        //Finding in the cache
        if(Persistence.cacheServices.has(serviceName)){
            

            //Reload from persistence
            let serv: Service = await ServiceModel.findById( Persistence.cacheServices.get(serviceName).serviceName );

            if(serv!=null)
                return Persistence.getEndpointsURLFromService(serv, environment);
            
        }

        //Finding in the persistence
        let serv: Service = await ServiceModel.findById(serviceName);

        if(serv==null){
            //Ricerca per Alias
            let _alias: Alias = await AliasModel.findById(serviceName).populate(serviceParent);

            if(_alias!=null)
                if(_alias.serviceParent!=null)
                    serv = _alias.serviceParent;
        }

        if(serv==null)
            throw new Error(`Service with name '${serviceName}' not exist!`);

        //Salvataggio in cache
        Persistence.cacheServices.set(serviceName, serv);

        return Persistence.getEndpointsURLFromService(serv, environment);
    }

    /**
     * Get only url endpoints that are equal to environment if give, and only enabled endpoint.
     * @param service 
     * @param environment 
     * @returns 
     */
    static getEndpointsURLFromService(service: Service, environment?: string): string[]{
        let ret = new Array<string>();

        service.endpointsDeployed
            .filter((endp)=>endp.enabled)
            .forEach((endp)=>{
                if(environment==undefined)
                    ret.push(endp.url);
                else
                    if(endp.environment==environment)
                        ret.push(endp.url);
            });

        return ret;
    }

}
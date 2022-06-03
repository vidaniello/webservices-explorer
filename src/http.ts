import express, {Express, NextFunction, Request, Response} from 'express';
import {Util} from './util';
import {Persistence} from './persistence';
import {StatusCodes} from 'http-status-codes';
import { Service } from './entities/entities';

export class Http{

    static app: Express;

    public static async init(){

        Http.app = express();

        Http.app.use(express.json());

        Http.app.set('etag', false);

        /**Initial interceptor */
        Http.app.use((req, res, next) => {
            res.set('Cache-Control', 'no-cache, no-store, max-age=0');
            res.set('Content-Type', 'application/json; charset=utf-8');
            next()
        });
        
        Http.app.listen(Util.getHttpListenPort(), ()=>{
            console.log("Http-server listen on port "+Util.getHttpListenPort());
        });

        Http.app.get('/', Http.onHomePage);

        Http.app.get('/closeApp', Http.onCloseApplication);
        Http.app.get('/resetServiceCache', Http.onResetServiceCache);

        Http.app.get('/getDbConnectionState', Http.onGetDbConnectionState);

        Http.app.post('/newService', Http.onNewService);
        Http.app.get('/getService/:endpointName', Http.onGetService);

        Http.app.post('/newAlias', Http.onNewAlias);
        Http.app.post('/newAlias/associate_to/:serviceName', Http.onNewAlias);
        Http.app.get('/getAlias/:aliasName', Http.onGetAlias);
        
        Http.app.post('/newType', Http.onNewType);
        Http.app.get('/getType/:objectTypeName', Http.onGetType);

        Http.app.get('/getEndpointsURL/:serviceName/env/:environment?', Http.onGetEndpointsUrl);
        Http.app.get('/getEndpointsURL/:serviceName', Http.onGetEndpointsUrl);

        /* final interceptor
        Http.app.use((req, res, next) => {
            let i = 0;
            res.end();
        });
        */
    }

    static onHomePage(req: Request, resp: Response){
        resp.send({appStatus: "Ok! "+new Date(), environment: (Util.isDevelopEnvironment()? 'DEVELOP':'PRODUCTION')});
    }

    static onGetDbConnectionState(req: Request, resp: Response){
        resp.send({mongDbConnectionStatus: Persistence.getConnectionState()});
    }

    static onCloseApplication(req: Request, resp: Response){
        //resp.send({appStatus: "Closing app!"});
        //process.exit();
        Http.onException(new Error('Function disabled!'), resp);
    }

    static onResetServiceCache(req: Request, resp: Response){
        Persistence.cacheServices.clear();
        resp.send({cacheStatus: "Cache cleared!"});
    }

    static async onNewService(req: Request, resp: Response){
        try {
            let toRet = await Persistence.addNewService(req.body);
            resp.send(toRet);
        } catch (error){
            Http.onException(error, resp);
        }
    }

    static async onGetService(req: Request, resp: Response, next: NextFunction){
        try {
            let toRet = await Persistence.getService(req.params['endpointName']);
            resp.send(toRet);
        } catch (error){
            Http.onException(error, resp);
        }

        //If the response is chained
        //resp.write(/*JSON.stringify(*/toRet/*, null, 2)*/);
        //resp.write(JSON.stringify(toRet));
        //next();
    }

    static async onNewAlias(req: Request, resp: Response){
        try {
            let toRet = null;

            if(req.params['serviceName']!==null && req.params['serviceName']!==''){
                toRet = await Persistence.addNewAliasAndAssociateToService(req.body, req.params['serviceName']);
            } else {
                toRet = await Persistence.addNewAlias(req.body);
            }

            resp.send(toRet);
        } catch (error){
            Http.onException(error, resp);
        }
    }

    static async onGetAlias(req: Request, resp: Response){
        try {
            let toRet = await Persistence.getAlias(req.params['aliasName']);
            resp.send(toRet);
        } catch (error){
            Http.onException(error, resp);
        }
    }

    static async onNewType(req: Request, resp: Response){
        try {
            let toRet = await Persistence.addNewType(req.body);
            resp.send(toRet);
        } catch (error){
            Http.onException(error, resp);
        }
    }

    static async onGetType(req: Request, resp: Response){
        try {
            let toRet = await Persistence.getType(req.params['objectTypeName']);
            resp.send(toRet);
        } catch (error){
            Http.onException(error, resp);
        }
    }

    static async onGetEndpointsUrl(req: Request, resp: Response){
        try {
            let serviceName = req.params['serviceName'];
            let environment = req.params['environment'];

            /*if(environment==undefined)
                return Persistence.getEndpoints(serviceName);
            else*/
            
            resp.send(await Persistence.getEndpointsURL(serviceName, environment));
        } catch (error){
            Http.onException(error, resp);
        }
    } 

    static onException(exception: Error | any, resp: Response){
        resp.status(StatusCodes.BAD_REQUEST)
            .send({exceptionType: exception.name, exceptionCode: exception.code, exceptionMessage: exception.message/*, stack: JSON.stringify(error.stack)*/});
    }
}
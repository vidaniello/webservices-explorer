#!/usr/bin/env node

import express, {Express, Request, Response} from 'express';
import {Util} from './util';

export class Main{

    static app: Express;
    public static start(): void{
        try{
            
            Util.init();
            /*
            process.addListener('exit', (evt)=>{
                console.log("Program closed");
            });
            */

            Main.app = express();

            Main.app.use(express.json());
        
            Main.app.listen(Util.getHttpListenPort(), ()=>{
                console.log("Http-server listen on port "+Util.getHttpListenPort());
            });
            
            Main.app.get('/', Main.onHomePage);

        } catch(err){
            console.error(err);
            throw err;
        }
    }

    static onHomePage(req: Request, resp: Response){
        resp.send("Ok! " + new Date());
    }
}

//if(__filename.endsWith('dist/main.js') || __filename.endsWith('dist\\main.js'))
Main.start();

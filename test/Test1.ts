import {Main} from '../src/Main';

export class Test1{

    public static async test1(): Promise<void>{
        try{
            console.log("Test started");
            Main.start(null);
        } catch(err){
            console.error(err);
        }
    }

}

if(__filename.endsWith('test/Test1.ts'))
    Test1.test1();


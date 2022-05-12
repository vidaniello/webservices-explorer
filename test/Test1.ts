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

if(__filename.endsWith('tests/test/test1.js') || __filename.endsWith('tests\\test\\test1.js'))
    Test1.test1();


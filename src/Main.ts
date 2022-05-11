
export class Main{
    public static async start(args: string[]): Promise<void>{
        try{
            console.log("Main started");
        } catch(err){
            console.error(err);
        }
    }
}

if(__filename.endsWith('dist/Main.js') || __filename.endsWith('dist\\Main.js'))
    Main.start(['g']);

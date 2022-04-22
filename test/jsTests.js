
function resolveAfter2Seconds() {
    return new Promise( (res, rej) => {
        
            setTimeout(() => {
                rej('an error');
            }, 2000);
        
        } );
}


async function asyncCall() {
    console.log('calling');
    try {
        const result = await resolveAfter2Seconds();
        console.log(result);
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}
  
asyncCall();


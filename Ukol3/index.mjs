import fs from 'fs/promises'



async function read(){
    try{
        const numberOfFiles = await fs.readFile('instrukce.txt');
        return Number(numberOfFiles.toString());

    }catch(err){
        console.error('Jejda');
        return 0;
    }
}

async function createFiles(){
    const numberOfFiles = await read();
    let array = []
    for(let i = 0; i < numberOfFiles; i++){
            let fileName = i+'.txt';
            let fileText = 'Soubor '+ i;
            let promise = fs.writeFile(fileName,fileText);
            array.push(promise);
    }
    try {
        if(array.length !==0){
            await Promise.all(array);
        console.log("Soubory vytvořeny");
        }
    } catch (error) {
        console.log('Chyba')
    }

}
await createFiles();

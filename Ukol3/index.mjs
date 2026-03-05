import fs from 'fs/promises'



async function read(){
    try{
        const numberOfFiles = await fs.readFile('instrukce.txt');
        return Number(numberOfFiles.toString());

    }catch(err){
        console.error('Jejda');
    }
}

async function createFiles(){
    const numberOfFiles = await read();
    console.log(numberOfFiles);
    for(let i = 0; i < numberOfFiles; i++){
        try{
            let fileName = i+'.txt';
            let fileText = 'Soubor '+ i;
            await fs.writeFile(fileName,fileText);
            if(i === numberOfFiles){
                console.log("Soubory vytvořeny")
            }

        }catch(err){
            console.error('Jejda');
        }
    }

}
createFiles();
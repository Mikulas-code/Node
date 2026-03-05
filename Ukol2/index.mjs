import fs from 'fs'

function readFile (input) {

    return new Promise((resolve,reject)=>{
        fs.readFile(input, (err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    }

    );
   
}

function writeFile (path, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, data, (err) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
}

async function copyWrite() {
    const instrukce = await readFile('instrukce.txt');
    const instrukceText = instrukce.toString();
    const vstup = instrukceText.split(',')[0];
    const vystup = instrukceText.split(',')[1];
    console.log(vstup);
    console.log(vystup);

    const obsah = await readFile(vstup);

    writeFile(vystup,obsah);

}
copyWrite();
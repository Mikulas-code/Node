import fs from 'fs'

function readFile () {
   fs.readFile('vstup.txt', (err,data)=>{
    if(err){
        console.error('chyba')
    }else{
        console.log(data.toString());
    }

   })
}
readFile();
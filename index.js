import chalk from 'chalk';
import http, { request } from 'http';
import fs from 'fs/promises';
import { error } from 'console';

const readHtml = async (path) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const data = await fs.readFile(path)
  const html = data.toString()
  return html

}

const server = http.createServer(async (request, response)=>{

  try{

    const URLPath = request.url;
    const parts = URLPath.split('/')
    console.log(parts[1]);
    const fileName = parts[1].toString();
    const path = './public/'+fileName;
    const html = await readHtml(path);
    console.log(html);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html')
    response.write(html)
    response.end();

  }catch(err){
    console.log(err);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html')
    response.write('<h1>Soubor nebyl nalezen</>');
    response.end();
  }
});


server.listen(8080,'localhost', () =>{
console.log(chalk.red('Server started on http://localhost:8080'));
});

 



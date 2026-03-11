import chalk from 'chalk';
import http, { request } from 'http';
import fs from 'fs/promises';

const readHtml = async (fileName) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const data = await fs.readFile(fileName)
  const html = data.toString()
  return html
}
 


const server = http.createServer(async (request, response)=>{
    console.log(request.url);

    const path = request.url;
    const parts = path.split('/')
    console.log(parts[1]);
    const fileName = parts[1].toString(); 

    const html = await readHtml(fileName);
    console.log(html);
    response.end();


    // if(request.url === '/test'){

    // const html = await readHtml('public/test.txt');
    // response.statusCode = 200;
    // response.setHeader('Content-Type', 'text/html')
    // response.setHeader('Location', '/test')
    // response.write(html)
    // response.end();
    // } else{
    // response.statusCode = 200;
    // response.setHeader('Content-Type', 'text/html')
    // response.write('<h1>File not found</h1>');
    // response.end();
    // }
});


server.listen(8080,'localhost', () =>{
console.log(chalk.red('Server started on http://localhost:8080'));
});

 



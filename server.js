const http = require('http');
const hostname = '127.0.0.1'; // localhost
const port = 3000;

let ausgabenListe = [];


const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Access-Control-Allow-Origin', '*');
    if (request.method === 'GET') {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(ausgabenListe));

    } else if (request.method === 'POST') {
        // Falls POST-Request, verarbeite die Daten
        request.on('data', (data) => {
            ausgabenListe.push(data);

        });
        request.on('end', () => {
        response.setHeader('Content-Type', 'application/json');
        console.log(JSON.stringify(ausgabenListe));
        response.end(JSON.stringify(ausgabenListe));
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });


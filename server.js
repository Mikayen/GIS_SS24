const http = require('http');
const hostname = '127.0.0.1'; // localhost
const port = 3000;

let ausgabenListe = [];


const server = http.createServer((request, response) => {
    if (request.method === 'GET') {
        response.end(JSON.stringify(ausgabenListe));

    } else if (request.method === 'POST') {
        // Falls POST-Request, verarbeite die Daten
        request.on('data', (data) => {
            ausgabenListe.push(data);
            localStorage.setItem('ausgabenListe', JSON.stringify(ausgabenListe));

        });

        request.on('end', () => {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(ausgabenListe));
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });


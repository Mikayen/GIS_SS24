const http = require('http');
const hostname = '127.0.0.1'; // localhost
const port = 3000;
const sqlite3 = require('sqlite3');


//let ausgabenListe = [];

const db = new sqlite3.Database('ausgabenliste.db');

db.serialize(() => {
    // Erstelle Tabelle
    db.run('CREATE TABLE IF NOT EXISTS ausgaben (id TEXT, betrag TEXT)');
});


const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    console.log(request.method);
    if (request.method === 'GET') {
        console.log("sind im get ")
        response.setHeader('Content-Type', 'application/json');
        db.all('SELECT * FROM ausgaben', (err, rows) => {
            console.log(JSON.stringify(err))
            console.log(JSON.stringify(rows))
        response.end(JSON.stringify(rows));
        
    })

    } else if (request.method === 'OPTIONS') {
        response.end();

        
    } else if (request.method === 'POST') {
        // Falls POST-Request, verarbeite die Daten
        console.log("sind im post ")
        let jsonString = '';
        request.on('data', (data) => {
            jsonString += data;

        });
        request.on('end', () => {
            console.log(jsonString)
            db.run('INSERT INTO ausgaben (id, betrag) VALUES (?, ?)', [JSON.parse(jsonString).id, JSON.parse(jsonString).betrag])
        });
        

    } else if (request.method === 'DELETE' &&  url.pathname === '/deleteall') {

        db.run('DELETE FROM ausgaben')

    } else if (request.method === 'DELETE') {
        let jsonString = '';
        request.on('data', (data) => {
            jsonString += data;
        });
        request.on('end', () => {
            const {id, betrag} = JSON.parse(jsonString);
            db.run('DELETE FROM ausgaben WHERE id = ?', [id])
        });
    
    } else if (request.method === 'PUT') {

        let jsonString = '';
        request.on('data', (data) => {
            jsonString += data;
        });
        request.on('end', () => {
            const { id, alteid, betrag } = JSON.parse(jsonString);
            console.log(id);
            console.log(alteid);
            console.log(betrag);
            db.run('UPDATE ausgaben SET betrag = ?, id = ? WHERE id = ?', [betrag, id, alteid]) 
            response.end(JSON.stringify({ id, betrag }));
            
        });
    }
    //response.end()
    /*db.each('SELECT * FROM ausgaben', (err, row) => {
        console.log(`${row.id} - ${row.betrag}`)})
*/
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });


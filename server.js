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
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'GET') {

        response.setHeader('Content-Type', 'application/json');
        db.all('SELECT * FROM ausgaben', (rows) => {
        response.end(JSON.stringify(rows));
        
    })

    } else if (request.method === 'POST') {
        // Falls POST-Request, verarbeite die Daten
        let jsonString = '';
        request.on('data', (data) => {
            jsonString += data;

        });
        request.on('end', () => {
            db.run('INSERT INTO ausgaben (id, betrag) VALUES (?, ?)', [JSON.parse(jsonString).id, JSON.parse(jsonString).betrag])
        });
        
    } else if (request.method === 'DELETE') {
        
        const idToDelete = request.url.substring('/ausgaben/'.length);
        db.run('DELETE FROM ausgaben WHERE id = ?', [idToDelete])
    } /*else if (request.method === 'DELETEALL') {
        db.run('DELETE FROM ausgaben')
    }*/
    else if (request.method === 'PUT') {
        let jsonString = '';
        request.on('data', (data) => {
            jsonString += data;
        });
        request.on('end', () => {
            const { id, betrag } = JSON.parse(jsonString);
            db.run('UPDATE ausgaben SET betrag = ? WHERE id = ?', [betrag, id]) 
            response.end(JSON.stringify({ id, betrag }));
            
        });
    }
    response.end()
    db.each('SELECT * FROM ausgaben', (err, row) => {
        console.log(`${row.id} - ${row.betrag}`)})

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });


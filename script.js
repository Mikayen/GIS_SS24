/*document.getElementById('allesLoeschenButton').addEventListener('click', function() {
    fetch('http://127.0.0.1:3000/', {
        method: 'DELETEALL',
    })
    .then(response => response.json())
    .then(() => { 
    location.reload();
    })
});*/

const { Console } = require("console");

document.getElementById('hinzufuegenButton').addEventListener('click', function() {
    // Eingabefeld für Ausgaben und Betrag anzeigen
    let ausgaben = prompt("Bitte geben Sie die Ausgaben ein:");
    let betrag = prompt("Bitte geben Sie den Betrag ein:");
    // Sicherstellen, dass beide Eingaben gemacht wurden
    if (ausgaben && betrag) {

        // Neue Zeile zur Tabelle hinzufügen
        let tabelle = document.getElementById('ausgabenTabelle').getElementsByTagName('tbody')[0];
        let neueReihe = tabelle.insertRow();

        // Zellen für Ausgaben und Betrag erstellen und befüllen
        let zelleAusgaben = neueReihe.insertCell(0);
        let zelleBetrag = neueReihe.insertCell(1);
        let zelleAktionen = neueReihe.insertCell(2);
        zelleAusgaben.textContent = ausgaben;
        zelleBetrag.textContent = betrag + '€';

        let bearbeitenButton = document.createElement('button');
        bearbeitenButton.className = 'bearbeitenButton';
        bearbeitenButton.textContent = 'Bearbeiten';
        bearbeitenButton.addEventListener('click', bearbeiten);
        zelleAktionen.append(bearbeitenButton);

        let loeschenButton = document.createElement('button');
        loeschenButton.className = 'loeschenButton';
        loeschenButton.textContent = 'Löschen';
        loeschenButton.addEventListener('click', loeschen);
        zelleAktionen.append(loeschenButton);

        
        let neueAusgabe = {
            id: ausgaben,
            betrag: betrag
        };

        fetch('http://127.0.0.1:3000/', {
            //Daten zum Server gesendet
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(neueAusgabe)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Serverantwort:', data);
        })

    } else {
        alert("Bitte geben Sie Ausgaben und Betrag ein.");
    }

    update();
});

function bearbeiten(event) {
    // Benutzer nach Ausgaben und Betrag fragen
    let ausgaben = prompt("Bitte geben Sie die neue Ausgabe ein:");
    let betrag = prompt("Bitte geben Sie den neuen Betrag ein:");

    // Sicherstellen, dass beide Eingaben gemacht wurden
    if (ausgaben && betrag) {
        // .target = knopf .targer.parent = zelle .target.parent.parent = zeile
        let zeile = event.target.parentElement.parentElement;
        // Zellen für Ausgaben und Betrag aktualisieren
        zeile.cells[0].textContent = ausgaben;
        zeile.cells[1].textContent = betrag + '€';

        let neueAusgabe = {
            id: ausgaben,
            betrag: betrag
        };

        fetch('http://127.0.0.1:3000/', {
            //Daten zum Server gesendet
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(neueAusgabe)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Serverantwort:', data);
        })

    } else {
        alert("Bitte geben Sie Ausgaben und Betrag ein.");
    }
    
    update();
}

function loeschen(event) {
    
    let zeile = event.target.parentElement.parentElement;
    console.log(zeile);
    if (confirm("Möchten Sie die Zeile löschen?")){
        zeile.remove();

        fetch('http://127.0.0.1:3000/', {
            method: 'DELETE'
        })
        .then(response => response.json())
    }
    update();
    
}

function update() {
    let gesamt = 0;
    let tabelle = document.getElementById('ausgabenTabelle').getElementsByTagName('tbody')[0];
    for (let row of tabelle.rows) {
        let betrag = parseFloat(row.cells[1].textContent);
        if (!isNaN(betrag)) { // Überprüft, ob betrag eine gültige Zahl ist
            gesamt += betrag;
        }
    }
    document.getElementById('gesamtBetrag').textContent = gesamt.toFixed(1) + '€';

}

// Beim Laden der Seite mit Daten füllen, falls vorhanden
window.addEventListener('DOMContentLoaded', function() {
    fetch('http://127.0.0.1:3000/')
            .then(response => response.json())
            .then(data => {
                let ausgabenListe = data;


        // Tabelle mit gespeicherten Daten füllen
        let tabelle = document.getElementById('ausgabenTabelle').getElementsByTagName('tbody')[0];
        ausgabenListe.forEach(function(Zeile) {
            console.log(Zeile)
            let newRow = tabelle.insertRow();
            let zelleAusgaben = newRow.insertCell(0);
            let zelleBetrag = newRow.insertCell(1);
            let zelleAktionen = newRow.insertCell(2);
            zelleAusgaben.textContent = Zeile.id;
            zelleBetrag.textContent = Zeile.betrag + '€';

            let bearbeitenButton = document.createElement('button');
            bearbeitenButton.className = 'bearbeitenButton';
            bearbeitenButton.textContent = 'Bearbeiten';
            bearbeitenButton.addEventListener('click', bearbeiten);
            zelleAktionen.append(bearbeitenButton);

            let loeschenButton = document.createElement('button');
            loeschenButton.className = 'loeschenButton';
            loeschenButton.textContent = 'Löschen';
            loeschenButton.addEventListener('click', loeschen);
            zelleAktionen.append(loeschenButton);
        });
        update();
    })
    // Gesamt aktualisieren
});


//Inputfelder / Formulare 
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const dbFilePath = 'hochschule.db'; // sqlite Datei

async function main() {
  // open the database
  const db = await sqlite.open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });

  //const students = await db.all('SELECT * FROM student');
  console.log("test");
  await db.close();
}

main();
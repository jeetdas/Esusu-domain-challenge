const sqlite3 = require("sqlite3").verbose();
const moment = require('moment');

let dbName = process.env.NODE_ENV === "test" ? "test.db" : "database.db";

const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log(`Connected to the ${dbName} database.`);
});

// Create properties managers table if it does not exist
db.run(
    `CREATE TABLE IF NOT EXISTS propertyManagers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )`,
    (err) => {
        if (err) {
            console.error(err.message);
        }
    }
);

// Create properties table if it does not exist
db.run(
    `CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propertyManagerId INTEGER NOT NULL,
    address TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (propertyManagerId) REFERENCES propertyManagers(id)
  )`,
    (err) => {
        if (err) {
            console.error(err.message);
        }
    }
);

// Create apartments table if it does not exist
db.run(
    `CREATE TABLE IF NOT EXISTS apartments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propertyId INTEGER NOT NULL,
    unitNumber TEXT NOT NULL,
    FOREIGN KEY (propertyId) REFERENCES properties(id)
  )`,
    (err) => {
        if (err) {
            console.error(err.message);
        }
    }
);

// Create tenants table if it does not exist
db.run(
    `CREATE TABLE IF NOT EXISTS tenants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      dob DATE NOT NULL,
      ssn TEXT NOT NULL,
      isPrimary INTEGER NOT NULL,
      apartmentId INTEGER NOT NULL,
      FOREIGN KEY (apartmentId) REFERENCES apartments(id)
    )`,
    (err) => {
        if (err) {
            console.error(err.message);
        }
    }
);

// Create payments table if it does not exist
db.run(
    `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY,
        tenantId INTEGER NOT NULL,
        amount REAL NOT NULL,
        date DATETIME NOT NULL,
        FOREIGN KEY(tenantId) REFERENCES tenants(id)
      )`,
    (err) => {
        if (err) {
            console.error(err.message);
        }
    }
);

module.exports = db;
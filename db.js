const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const dbexists = fs.existsSync('./.data/sqlite.db');
const db = new sqlite.Database('./.data/sqlite.db');

/**
 * Erstellt die notwendigen Tabellen falls noch keine Datei(DB) existiert
 */
if (!dbexists) {
    db.run(`
    CREATE TABLE service_technician (
        personal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        fname TEXT NOT NULL,
        lname TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    );`
    );
    db.run(`
    CREATE TABLE service_ispaid(
        service_ispaid_id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_ispaid_txt TEXT NOT NULL
    );`
    );
    db.run(`
    CREATE TABLE project_status(
        project_status_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_status_txt TEXT NOT NULL
    );`
    );
    db.run(`
    CREATE TABLE customer(
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        fname_poc TEXT,
        lname_poc TEXT,
        company TEXT NOT NULL,
        street TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        location TEXT NOT NULL
    );`
    );
    db.run(`
    CREATE TABLE project(
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_title TEXT,
        description TEXT,
        customer_id INTEGER NOT NULL,
        project_status_id INT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
        FOREIGN KEY (project_status_id) REFERENCES project_status(project_status_id)
        );`
    );
    db.run(`
    CREATE TABLE service(
        service_id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        tt_start TIME,
        tt_end TIME,
        wh_start TIME,
        wh_end TIME,
        job_description TEXT,
        project_id INTEGER NOT NULL,
        personal_id INTEGER NOT NULL,
        service_ispaid_id INTEGER NOT NULL,
        FOREIGN KEY (project_id) REFERENCES project(project_id),
        FOREIGN KEY (personal_id) REFERENCES service_technician(personal_id),
        FOREIGN KEY (service_ispaid_id) REFERENCES serv_cat(service_ispaid_id)
    );`
    );

}

module.exports = db;



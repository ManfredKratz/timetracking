const db = require('../db');

module.exports = {
    /**
     * ********* PROJEKT STATUS ********
     * Daten dazu werden beim ersten erstellen eines Service Technikers in die DB geschrieben
     * Es ist nicht vorgesehen, dass weitere Status erstellt werden
     * siehe create_service_technician in service_technician_sql.js!
     */
    create_project_status: data => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO project_status (project_status_txt)
                VALUES ($project_status_txt)`,
                {
                    $project_status_txt: data.project_status_txt
                },
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM project_status WHERE project_status_id = $project_status_id`, { $project_status_id: this.lastID }, (err2, result) => {
                        if (err2) {
                            reject(err2);
                        }
                        else {
                            resolve(result);
                        }
                    });
                }
            )
        });
    },
    /**
     * Gibt alle existierenden Status zurück
     */
    get_all_project_status: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM project_status`, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    },
    /**
     * ID eines Projekts wird übergeben und in der DB abgefragt
     * Der Projektstatus zu dem Projekt wird zurückgegeben
     */
    get_project_status: (id) =>{
        return new Promise((resolve, reject) => {
            db.get(`SELECT ps.project_status_txt FROM project p, project_status ps WHERE p.project_status_id  = ps.project_status_id AND project_id = $project_id`, { $project_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    },
}
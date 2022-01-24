const db = require('../db');

module.exports = {
    /**
     * ************ SERVICE IS PAID **************
     * Die Daten dazu werden beim ersten Erstellen eines Servicetechniker erstellt!!
     * Siehe create_service_technician in service_technician_sql.js
     */
    create_service_ispaid: data => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO service_ispaid (service_ispaid_txt)
                VALUES ($service_ispaid_txt)`,
                {
                    $service_ispaid_txt: data.service_ispaid_txt
                },
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM service_ispaid WHERE service_ispaid_id = $service_ispaid_id`, { $service_ispaid_id: this.lastID }, (err2, result) => {
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
     * Gibt alle vorhanden Einträge in der DB zu service_ispaid zurück
     */
    get_all_service_ispaid: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM service_ispaid`, (err, result) => {
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
     * Gibt Bezahlstatus zu einem angefragten Service zurück
     * Service mit mittels der übertragenen ID ermittelt
     */
    get_service_ispaid: (id) =>{
        return new Promise((resolve, reject) => {
            db.get(`SELECT sip.service_ispaid_txt FROM service_ispaid sip, service s WHERE s.service_ispaid_id  = sip.service_ispaid_id AND service_id = $service_id`, { $service_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    },
}
const db = require('../db');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
module.exports = {
    /**
     * *********** SERVICE TECHNIKER ********************
     * Ein Service Techniker wird erstellt
     * Jedes Passwort wird mit Salt erweitert und danach mit bcryptjs gehasht
     * Beim ersten Erstellen eines Service Technikers werden Bezahl und Projektstatus erstellt
     */
    create_service_technician: data => {
        return new Promise((resolve, reject) => {
            var hash_pwd = bcrypt.hashSync(data.password, salt);
            db.run(`INSERT INTO service_technician (fname, lname, email, password)
                VALUES ($fname, $lname, $email, $password)`,
                {
                    $fname: data.fname,
                    $lname: data.lname,
                    $email: data.email,
                    $password: hash_pwd
                },
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM service_technician WHERE personal_id = $personal_id`, { $personal_id: this.lastID }, (err2, result) => {
                        if(this.lastID == 1){
                            db.run(`INSERT INTO project_status (project_status_txt)
                            VALUES ('Aktiv');`
                            );
                            db.run(`INSERT INTO project_status (project_status_txt)
                            VALUES ('Beendet')`
                            );
                            db.run(`INSERT INTO service_ispaid (service_ispaid_txt)
                            VALUES ('Offen')`
                            );
                            db.run(`INSERT INTO service_ispaid (service_ispaid_txt)
                            VALUES ('Bezahlt')`
                            );
                        }
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
     * Gibt alle existierenden Service Techniker zurück
     */
    get_all_service_technician: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM service_technician`, (err, result) => {
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
     * Service Techniker wird in der Datenbank gesucht und als Ergebnis zurückgegeben
     */
    find_service_technician_by_id: personal_id => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM service_technician WHERE personal_id = $personal_id`, { $personal_id: personal_id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
	/**
     * Ein Einsatztechniker wird anhand seiner email gesucht und zurückgegeben
     */
    find_service_technician_email: data => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM service_technician WHERE email = $email`, { $email: data.email }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    },
	/**
     * Wird überprüft, ob ein Einsatztechniker mit der übergebenen ID existiert
     * erst in der INDEX.js wird dann ein TRUE oder FALSE interpretiert
     */
	bool_exist_service_technician: (id) => {
			return new Promise((resolve, reject) => {
				db.get(`SELECT * FROM service_technician WHERE personal_id = $personal_id`, { $personal_id: id }, (err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
			});
	 
    },
    /**
     * gibt das gehashte Passwort zu einer angefragten E-Mail zurück
     * daraufhin wird mit bcrypt geprüft, ob das Passwort übereinstimmt
     * Ist das Passwort korrekt wird True übergeben
     */
    get_pwd_service_technician: (data) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT password FROM service_technician WHERE email = $email`,
                {
                    $email: data.email
                },
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result != undefined) {
                            var pwd = JSON.stringify(result.password);
                            pwd = pwd.replace(/"/g, '');
                            bool_check_pwd = bcrypt.compareSync(data.password, pwd);
                            if (bool_check_pwd == true) {
                                resolve(true)
                            } else {
                                resolve(false)
                            }

                        }
                        else {
                            resolve(false)
                        }

                    }
                });

        });
    },
    /**
     * Gibt alle Daten, außer das Passwort, zu einem Servicetechniker zurück 
     * Die Daten werden als Payload beim JsonWebToken übergeben
     */
    get_data_service_technician: data => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT personal_id, fname, lname, email FROM service_technician WHERE email = $email`, { $email: data.email }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    /**
     * Gibt alle Einsätze zurück, die einem Service Techniker zugeordnet sind 
     */
    get_service_technician_service: id => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM service WHERE personal_id = $personal_id`, { $personal_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    /**
     * Gibt alle Projekte zurück, die einem Service Techniker zugeordnet sind
     */
    get_service_technician_project: id => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM project CROSS JOIN service WHERE personal_id = $personal_id ORDER BY project_id DESC`, { $personal_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

}
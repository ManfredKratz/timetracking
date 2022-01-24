const db = require('../db');

module.exports = {
    /**
     * *****  Funktionen für die Projekte *********
     *
     * Erstelle ein Projekt, speichere in DB ab und gib JSON zurück
     */
    create_project: data => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO project (project_title, description, customer_id, project_status_id) VALUES ($project_title, $description, $customer_id, $project_status_id)`,
                {
                    $project_title: data.project_title,
                    $description: data.description,
                    $customer_id: data.customer_id,
                    $project_status_id: data.project_status_id
                },
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM project WHERE project_id = $project_id`, { $project_id: this.lastID }, (err2, result) => {
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
     * Es werden alle Projekte und die dazugehörigen Einsätze ausgegeben 
     * Mit einer Variable wird gemerkt wie viele Projekte schon bearbeitet wurden
     * Zu den Projekten wird ein Attribut(array) hinzugefügt in das alle Einsätze eingefügt wird
     * In "array" werden alle Projekte mit ihren Einsätzen gespeichert
     * Bevor das Array zurückgegeben wird, wird dieses sortiert
     */
    get_all_project_with_service: () => {
        return new Promise((resolve, reject) => {
            array = []
            db.all(`SELECT * FROM project`, (err, result) =>{
                if(err) {
                    reject(err);
                }else{      
                    var itemProcessed = 0;
                    result.forEach(element => {

                        project_id = element.project_id;
                        db.all(`SELECT * from service where project_id = $project_id`,{$project_id: project_id}, (err, result2) =>{
                            if(err){
                                reject(err);
                            }
                            else {
                                element = JSON.parse(JSON.stringify(element));
                                element.servicebyproject = [];
                                element.servicebyproject.push(result2);
                                array.push(element);
                                itemProcessed++;
                            }
                            if(itemProcessed === result.length){
                                array.sort((a,b) => parseInt(a.project_id) - parseInt(b.project_id));
                                resolve(array);
                            }



                        });

                    });

                
                }

            });
        });
    },

    /** 
     * Alle Projekte die zu einer Customer_id gehören und noch !aktiv! sind werden ausgegeben
     * Der Funktion wird die Cusomter_id übergeben 
     */ 
    get_project_by_customer: (id) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT p.project_id, p.project_title, p.description, ps.project_status_txt FROM project p, project_status ps WHERE p.customer_id = $customer_id AND p.project_status_id = ps.project_status_id AND ps.project_status_txt = 'Aktiv'`, { $customer_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    /**
     * Finde Projekt mit der project_id 
     * ID wird an die Funktion übergeben
     */
    find_project_by_id: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM project WHERE project_id = $project_id`, { $project_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },    
    /**
     * Ändere Daten zu einem existierenden Projekt
     * Es wird mit If-Blöcken überprüft welche Daten angegeben wurden
     * Daraufhin werden diese Werte geändert
     */
    update_project: (id, data) => {
        return new Promise((resolve, reject) => {
            /**project_title*/
            if(data.project_title != undefined && data.description == undefined){
                db.get(`UPDATE project SET project_title = $project_title WHERE project_id = $project_id`,
                {
                    $project_id: id,
                    $project_title: data.project_title
                },
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
            /**description */
            else if(data.project_title == undefined && data.description != undefined){
                db.get(`UPDATE project SET description = $description WHERE project_id = $project_id`,
                {
                    $project_id: id,
                    $description: data.description
                },
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
            /**project_title & description */
            else if(data.project_title != undefined && data.description != undefined){
                db.get(`UPDATE project SET project_title = $project_title, description = $description WHERE project_id = $project_id`,
                {
                    $project_id: id,
                    $project_title: data.project_title,
                    $description: data.description
                },
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
            else{
                result = "Input incorrect";
                reject(result);
            }
        });

    },
    /**
     * Existiert ein Projekt mit der ID? In der Index.js wird festgelegt, ob TRUE oder FALSE zurückgegeben wird 
     */
    bool_exist_project: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM project WHERE project_id = $project_id`, { $project_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    },    
    /**
     * Ändert den Projekt_status zu der angegebenen id
     * Mit "id" wird die project_id abgefrasgt
     * Mit "data" wird angegeben welche project_status_id geändert wird
    */
    update_project_status:(id, data) => {
        return new Promise((resolve, reject) =>{
            if (data.project_status_id != undefined) {
                db.get(`UPDATE project SET project_status_id = $project_status_id WHERE project_id = $project_id`,
                    {
                        $project_id: id,
                        $project_status_id: data.project_status_id
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                });
            }
        });
    }
    
}
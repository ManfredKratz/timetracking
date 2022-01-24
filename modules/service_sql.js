const db = require('../db');

module.exports = {
    /**
     * ******************** SERVICE *********************
     * tt_ = travel time -> Fahrzeiten
     * wh_ = working hours -> Arbeitszeit
     * Alle Felder mit tt_ oder mit wh_ werden sind TIME; Format -> HH:MM:SS
     * DATE Format -> YYYY-MM-DD
     * 
     * Erstellt einen Einsatz und speichert diesen in der DB ab
     */
    create_service: data => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO service (date, tt_start, tt_end, wh_start, wh_end, job_description, project_id, personal_id, service_ispaid_id) 
                    VALUES ($date, $tt_start, $tt_end, $wh_start, $wh_end, $job_description, $project_id, $personal_id, $service_ispaid_id )`,
                {
                    $date: data.date,
                    $tt_start: data.tt_start,
                    $tt_end: data.tt_end,
                    $wh_start: data.wh_start,
                    $wh_end: data.wh_end,
                    $job_description: data.job_description,
                    $project_id: data.project_id,
                    $personal_id: data.personal_id,
                    $service_ispaid_id: data.service_ispaid_id
                },
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM service WHERE service_id = $service_id`, { $service_id: this.lastID }, (err2, result) => {
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
     * Gibt alle existierenden Einsätze zurück
     */
    get_all_service: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM service`, (err, result) => {
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
     * ID wird übergeben und in der DB wird dazugehöriger Einsatz gesucht und zurückgegeben
     */
    find_service_by_id: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM service WHERE service_id = $service_id`, { $service_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    /**
     * Überprüfen, ob ein Service mit gesuchten ID existiert
     * Rückgabewert ist undefined oder JSON 
     * In der Index.js wird dann entschieden ob TRUE oder FALSE zurückgegeben wird
     */
    bool_exist_service: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM service WHERE service_id = $service_id`, { $service_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    },
    /**
     * Jegliche Möglichkeiten wurden zum Ändern der Daten wurde beachtet
     * tt_start tt_end wh_start wh_end job_description können geändert werden
     */
    update_service: (id, data) => {

        return new Promise((resolve, reject) => {
            /**tt_start */
            if (data.tt_start != undefined && data.tt_end == undefined && data.wh_start == undefined && data.wh_end == undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_start = $tt_start WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_start: data.tt_start
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**tt_start */
            else if (data.tt_start == undefined && data.tt_end != undefined && data.wh_start == undefined && data.wh_end == undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_end = $tt_end WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_end: data.tt_end
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**tt_start und tt_end */
            else if (data.tt_start != undefined && data.tt_end != undefined && data.wh_start == undefined && data.wh_end == undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_start = $tt_start, tt_end = $tt_end WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_start: data.tt_start,
                        $tt_end: data.tt_end
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**wh_start */
            else if (data.tt_start == undefined && data.tt_end == undefined && data.wh_start != undefined && data.wh_end == undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET wh_start = $wh_start WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $wh_start: data.wh_start
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**wh_end */
            else if (data.tt_start == undefined && data.tt_end == undefined && data.wh_start == undefined && data.wh_end != undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET wh_end = $wh_end WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $wh_end: data.wh_end
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**wh_start und wh_end */
            else if (data.tt_start == undefined && data.tt_end == undefined && data.wh_start != undefined && data.wh_end != undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET wh_start = $wh_start, wh_end = $wh_end WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $wh_start: data.wh_start,
                        $wh_end: data.wh_end
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**tt_start und wh_start */
            else if (data.tt_start != undefined && data.tt_end == undefined && data.wh_start != undefined && data.wh_end == undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_start = $tt_start, wh_start = $wh_start WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_start: data.tt_start,
                        $wh_start: data.wh_start
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**tt_start und wh_end */
            else if (data.tt_start != undefined && data.tt_end == undefined && data.wh_start == undefined && data.wh_end != undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_start = $tt_start, wh_end = $wh_end WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_start: data.tt_start,
                        $wh_end: data.wh_end
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**tt_end und wh_start */
            else if (data.tt_start == undefined && data.tt_end != undefined && data.wh_start != undefined && data.wh_end == undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_end = $tt_end, wh_start = $wh_start WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_end: data.tt_end,
                        $wh_start: data.wh_start
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**tt_end und wh_end */
            else if (data.tt_start == undefined && data.tt_end != undefined && data.wh_start == undefined && data.wh_end != undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_end = $tt_end, wh_end = $wh_end WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_end: data.tt_end,
                        $wh_end: data.wh_end
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }                                                     
            /**tt_start tt_end wh_start wh_end */
            else if (data.tt_start != undefined && data.tt_end != undefined && data.wh_start != undefined && data.wh_end != undefined && data.job_description == undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET
                tt_start = $tt_start,
                tt_end = $tt_end,
                wh_start = $wh_start, 
                wh_end = $wh_end
                WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_start: data.tt_start,
                        $tt_end: data.tt_end,
                        $wh_start: data.wh_start,
                        $wh_end: data.wh_end
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**job_description */
            else if (data.tt_start == undefined && data.tt_end == undefined && data.wh_start == undefined && data.wh_end == undefined && data.job_description != undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET job_description = $job_description WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $job_description: data.job_description
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**job_description tt_start */
            else if (data.tt_start != undefined && data.tt_end == undefined && data.wh_start == undefined && data.wh_end == undefined && data.job_description != undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_start = $tt_start, job_description = $job_description WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_start: data.tt_start,
                        $job_description: data.job_description
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**job_description tt_end */
            else if (data.tt_start == undefined && data.tt_end != undefined && data.wh_start == undefined && data.wh_end == undefined && data.job_description != undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_end = $tt_end, job_description = $job_description WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_end: data.tt_end,
                        $job_description: data.job_description
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }            
            /**job_description tt_start tt_end */
            else if (data.tt_start != undefined && data.tt_end != undefined && data.wh_start == undefined && data.wh_end == undefined && data.job_description != undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET tt_start = $tt_start, tt_end = $tt_end, job_description = $job_description WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_start: data.tt_start,
                        $tt_end: data.tt_end,
                        $job_description: data.job_description
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**job_description wh_start */
            else if (data.tt_start == undefined && data.tt_end == undefined && data.wh_start != undefined && data.wh_end == undefined && data.job_description != undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET wh_start = $wh_start, job_description = $job_description WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $wh_start: data.wh_start,
                        $job_description: data.job_description
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**job_description wh_end */
            else if (data.tt_start == undefined && data.tt_end == undefined && data.wh_start == undefined && data.wh_end != undefined && data.job_description != undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET wh_end = $wh_end, job_description = $job_description WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $wh_end: data.wh_end,
                        $job_description: data.job_description
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }            
            /**job_description ww_start wh_end */
            else if (data.tt_start == undefined && data.tt_end == undefined && data.wh_start != undefined && data.wh_end != undefined && data.job_description != undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET wh_start = $wh_start, wh_end = $wh_end, job_description = $job_description WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $wh_start: data.wh_start,
                        $wh_end: data.wh_end,
                        $job_description: data.job_description
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**job_description tt_start tt_end wh_start wh_end */
            else if (data.tt_start != undefined && data.tt_end != undefined && data.wh_start != undefined && data.wh_end != undefined && data.job_description != undefined && data.is_paid == undefined) {
                db.get(`UPDATE service SET 
                tt_start = $tt_start,
                tt_end = $tt_end,
                wh_start = $wh_start,
                wh_end = $wh_end, 
                job_description = $job_description 
                WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $tt_start: data.tt_start,
                        $tt_end: data.tt_end,
                        $wh_start: data.wh_start,
                        $wh_end: data.wh_end,
                        $job_description: data.job_description
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }                                                                                                                                                           
            else {
                result = "Input incorrect";
                reject(result);
            }

        });
    },
    delete_service: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`DELETE FROM service WHERE service_id = $service_id`, { $service_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    /**
     *  Ein Service wird zu einer abgefragten Projekt_id zurückgegeben
     */
    get_service_by_project: (id) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM service WHERE project_id = $project_id`,{$project_id: id}, (err, result) =>{
                if(err) {
                    reject(err);
                }else{
                    resolve(result)
                }
            });
        });
    },

    /**
     * Es wird der Bezahlstatus zu einem Einsatz geändert und zurückgegeben
     */
    update_service_is_paid:(id, data) => {
        return new Promise((resolve, reject) =>{
            if (data.service_ispaid_id != undefined) {
                db.get(`UPDATE service SET service_ispaid_id = $service_ispaid_id WHERE service_id = $service_id`,
                    {
                        $service_id: id,
                        $service_ispaid_id: data.service_ispaid_id
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
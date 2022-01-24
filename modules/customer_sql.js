const db = require('../db');


module.exports = {
    /** ******** Funktionen zu Kunden ***********
     * Erstellt einen Kunden und speichert diesen in der DB ab
     * _poc = Person of Contact (Ansprechpartner)
     * */ 
    create_customer: data => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO customer (fname_poc, lname_poc, company, street, postal_code, location)
                    VALUES ($fname_poc, $lname_poc, $company, $street, $postal_code, $location)`,
                {
                    $fname_poc: data.fname_poc,
                    $lname_poc: data.lname_poc,
                    $company: data.company,
                    $street: data.street,
                    $postal_code: data.postal_code,
                    $location: data.location
                },
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM customer WHERE customer_id = $customer_id`, { $customer_id: this.lastID }, (err2, result) => {
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
     * Alle Kunden, die in der DB angelegt sind, werden ausgegeben
     *  */
    get_all_customer: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM customer`, (err, result) => {
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
     * Es wird eine ID empfangen, die mit der DB abgeglichen wird und gibt den Kunden mit der zugehörigen ID zurück */
    find_customer_by_id: customer_id => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM customer WHERE customer_id = $customer_id`, { $customer_id: customer_id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    /** 
     * Ändert Daten zu einem Kunden und speichere Änderung in DB
     * Es wird differenziert welche Daten geändert werden wollen
     */
    update_customer: (id, data) => {
        return new Promise((resolve, reject) => {
            /**
             * Damit der Name des Ansprechpartners geändert werden kann müssen alle POC-Felder geändert werden -> fname_poc, lname_poc
             */
            if ((data.fname_poc != undefined && data.lname_poc != undefined) && data.street == undefined && data.postal_code == undefined && data.location == undefined) {
                db.get(`UPDATE customer SET 
                fname_poc = $fname_poc,
                lname_poc = $lname_poc
    
                WHERE customer_id = $customer_id`,
                    {
                        $customer_id: id,
                        $fname_poc: data.fname_poc,
                        $lname_poc: data.lname_poc
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**
             * Daten zur Adresse können nur zusammen geändert werden
             * Hier wird überprüft, ob alle Adressfelder angegeben wurden und ob POC-Felder NICHT ausgewählt wurden
             */
            else if (data.street != undefined && data.postal_code != undefined && data.location != undefined && (data.fname_poc == undefined && data.lname_poc == undefined)) {
                db.get(`UPDATE CUSTOMER SET
               street = $street,
               postal_code = $postal_code,
               location = $location
               WHERE customer_id = $customer_id`,
                    {
                        $customer_id: id,
                        $street: data.street,
                        $postal_code: data.postal_code,
                        $location: data.location
                    },
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            }
            /**
             * Alle Felder wurden ausgewählt und werden geändert -> Adressdaten und POC-Daten
             */
            else if (data.street != undefined  && data.postal_code != undefined && data.location != undefined && data.fname_poc != undefined && data.lname_poc != undefined) {
                db.get(`UPDATE CUSTOMER SET  
                fname_poc = $fname_poc,
                lname_poc = $lname_poc,
                street = $street,
                postal_code = $postal_code,
                location = $location
                WHERE customer_id = $customer_id`,
                    {
                        $customer_id: id,
                        $fname_poc: data.fname_poc,
                        $lname_poc: data.lname_poc,
                        $street: data.street,
                        $postal_code: data.postal_code,
                        $location: data.location

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
	/**
     * Gibt Boolean zurück, ob Kunde existiert -> relevant im Front-End
     */
    bool_exist_customer: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM customer WHERE customer_id = $customer_id`, { $customer_id: id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    }
}
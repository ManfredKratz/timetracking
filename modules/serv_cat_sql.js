const db = require('../db');

module.exports = {
    //<--------------------SERVICE CATEGORY-------------------->
    create_service_category: data => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO serv_cat (service_category)
                VALUES ($service_category)`,
                {
                    $service_category: data.service_category
                },
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM serv_cat WHERE service_cat_id = $service_cat_id`, { $service_cat_id: this.lastID }, (err2, result) => {
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
    get_all_service_category: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM serv_cat`, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
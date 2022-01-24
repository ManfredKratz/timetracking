const db = require('../db');

module.exports = {
    //<--------------------BILLING CATEGORY-------------------->
    create_billing_category: data => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO bil_cat (billing_category)
                VALUES ($billing_category)`,
                {
                    $billing_category: data.billing_category
                },
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM bil_cat WHERE billing_id = $billing_id`, { $billing_id: this.lastID }, (err2, result) => {
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
    get_all_billing_category: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM bil_cat`, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    },
}
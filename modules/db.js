const mysql = require('mysql');
// const db_settings = require('../config');
const { local_conf, db_settings } = require('../config');
const fs = require('fs');
module.exports.getConnection = function getConnection() {
    return new Promise((resolve, reject) => {
        try {
            const connection = mysql.createConnection(db_settings);
            connection.connect((error) => {
                if (error) {
                    console.error(error.message || error.stack);
                    reject(error);
                }
                resolve(connection);
            });
        } catch (error) {
            console.error(error.message || error.stack);
            reject(error);
        }
    });
};

module.exports.getKasseAndDomain = function () {
    return new Promise((resolve, reject) => {
        let rawdata = fs.readFileSync(local_conf);
        let conf = JSON.parse(rawdata);
        resolve(conf);
    });
};
module.exports.getDomainName = function (connection, domainId) {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT login FROM `owners` WHERE id=?;',
            [domainId],
            (error, results, fields) => {
                if (error) {
                    console.error(error.message || error.stack);
                    reject(error);
                }
                resolve(results[0].login);
            }
        );
    });
};

module.exports.getMysqlVersion = function (connection) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT VERSION() as v;', (error, results, fields) => {
            if (error) {
                console.error(error.message || error.stack);
                reject(error);
            }
            resolve(results[0].v);
        });
    });
};

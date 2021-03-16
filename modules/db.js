const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
// const { local_conf, db_settings } = require('../config');
const local_conf = conf.local_conf;
const db_settings = conf.db_settings;
module.exports.getConnection = function getConnection() {
    return new Promise((resolve, reject) => {
        try {
            const connection = mysql.createConnection(db_settings);
            if (!connection) reject();
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
    }).catch((error) => {
        console.log('caught', error.message);
    });
};

module.exports.getKasseAndDomain = function () {
    return new Promise((resolve, reject) => {
        try {
            let rawdata = fs.readFileSync(local_conf);
            let conf = JSON.parse(rawdata);
            resolve(conf);
        } catch (error) {
            reject(error);
        }
    }).catch((error) => {
        console.log('caught', error.message);
    });
};
module.exports.getDomainName = function (connection, domainId) {
    return new Promise((resolve, reject) => {
        try {
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
        } catch (error) {
            console.error(error.message || error.stack);
            reject(error);
        }
    }).catch((error) => {
        console.log('caught', error.message);
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
    }).catch((error) => {
        console.log('caught', error.message);
    });
};

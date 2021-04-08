const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
// const { local_conf, db_settings } = require('../config');
const local_conf = conf.local_conf;
const db_settings = conf.db_settings;
module.exports.getConnection = function getConnection() {
    return new Promise((resolve, reject) => {
        // try {
        const connection = mysql.createConnection(db_settings);
        if (!connection) reject('cannot connect');
        connection.connect((error) => {
            if (error) {
                console.error(error.message || error.stack);
                reject(error);
            }
            resolve(connection);
        });
        // } catch (error) {
        //     console.error(error.message || error.stack);
        //     reject(error);
        // }
    });
};

module.exports.getKasseAndDomain = function () {
    return new Promise((resolve, reject) => {
        // try {
        let rawdata = fs.readFileSync(local_conf);
        let conf = JSON.parse(rawdata);
        if (typeof conf != 'undefined') resolve(conf);
        else reject('cannot read kasse-domain conf');
        // } catch (error) {
        //     reject(error);
        // }
    });
};
module.exports.getDomainName = function (connection, domainId) {
    return new Promise((resolve, reject) => {
        // try {
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
        // } catch (error) {
        //     console.error(error.message || error.stack);
        //     reject(error);
        // }
    }).catch((error) => {
        console.log('caught getDomainName', error.message);
        reject(error);
    });
};

module.exports.getMysqlVersion = function (connection) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT VERSION() as v;', (error, results, fields) => {
            if (error) {
                console.error(error.message || error.stack);
                reject('mysql version error', error);
            }
            resolve(results[0].v);
        });
    });
};

module.exports.closeConnection = async function closeConnection(connection) {
    // try {
    return new Promise((resolve, reject) => {
        // try {
        if (connection)
            connection.end(function (err) {
                reject(err);
            });
        resolve('ok');
        // } catch (error) {
        //     console.error(error.message || error.stack);
        //     reject(error);
        // }
    });
    // } catch (error_1) {
    //     console.log('caught', error_1.message);
    // }
};

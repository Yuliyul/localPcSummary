const os = require('os');
const checkDiskSpace = require('check-disk-space');
const pretty = require('prettysize');
const mysql = require('mysql');
const db_settings = require('../config');
const fs = require('fs');
const getLastLine = require('./lastLine').getLastLine;

const PCSummary = {};

PCSummary.platform = os.platform();
PCSummary.osname = os.type();
PCSummary.arch = os.arch();
PCSummary.uptime = os.uptime();
PCSummary.freesysmem = pretty(os.freemem());
PCSummary.totalmem = pretty(os.totalmem());
PCSummary.cpu = os.cpus()[0].model;
const fileName = 'C:\\xampp\\php\\logs\\php_error_log';
const minLineLength = 1;
let phplog = getLastLine(fileName, 1, 'php-log')
    .then((lastLine) => {
        return lastLine;
    })
    .catch((err) => {
        console.error(err);
    })
    .then(function (result) {
        return result;
    });
PCSummary.phplog = phplog;
try {
    const connection = mysql.createConnection(db_settings.db_settings);
    connection.connect(function (err) {
        if (err) {
            return console.error('Error: ' + err.message);
        } else {
            console.log('Connected');
        }
    });
    connection.query(
        'SELECT VERSION() as v;',
        function (error, results, fields) {
            console.log(results[0].v);
            PCSummary.mysqlversion = results[0].v;
            // versionmysql = results[0].v;
        }
    );
} catch (e) {
    console.log(e);
}
module.exports = PCSummary;

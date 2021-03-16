const fs = require('fs');
const ini = require('ini');
const path = require('path');
const parseString = require('xml2js').parseString;

module.exports.getFFVersion = function () {
    var fileName = 'C:/Program Files/Mozilla Firefox/application.ini';
    return new Promise((resolve, reject) => {
        try {
            var config = ini.parse(fs.readFileSync(fileName, 'utf-8'));
            // console.log(config);
            // var obj = JSON.parse(fs.readFileSync(fileName, 'utf8'));
            resolve(config.App.Version);
        } catch (error) {
            console.error(error.message || error.stack);
            reject(error);
        }
    }).catch((error) => {
        console.log('caught', error.message);
    });
};
module.exports.getChromeVersion = function () {
    var fileName =
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.VisualElementsManifest.xml';
    return new Promise((resolve, reject) => {
        try {
            parseString(
                fs.readFileSync(fileName, 'utf-8'),
                function (err, result) {
                    let vers = result.Application.VisualElements[0].$.Square44x44Logo.split(
                        '\\'
                    );
                    resolve(vers[0]);
                }
            );
            var config = ini.parse(fs.readFileSync(fileName, 'utf-8'));
            resolve(config.App.Version);
        } catch (error) {
            console.error(error.message || error.stack);
            reject(error);
        }
    }).catch((error) => {
        console.log('caught', error.message);
    });
};

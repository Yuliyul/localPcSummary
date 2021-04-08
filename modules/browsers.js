const fs = require('fs');
const ini = require('ini');
const path = require('path');
const parseStringXML = require('xml2js').parseString;
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
const FFPath = conf.FFPath;
const ChromePath = conf.ChromePath;
module.exports.getFFVersion = function () {
    return new Promise((resolve, reject) => {
        // try {
        var config = ini.parse(fs.readFileSync(FFPath, 'utf-8'));
        if (typeof config != 'undefined') resolve(config.App.Version);
        else reject('cannot read FF conf file');
        // } catch (error) {
        //     console.error(error.message || error.stack);
        //     reject(error);
        // }
    });
};
module.exports.getChromeVersion = function () {
    return new Promise((resolve, reject) => {
        // try {
        parseStringXML(
            fs.readFileSync(ChromePath, 'utf-8'),
            function (err, result) {
                if (err) reject(err);
                let vers = result.Application.VisualElements[0].$.Square44x44Logo.split(
                    '\\'
                );
                resolve(vers[0]);
            }
        );
        // } catch (error) {
        //     console.error(error.message || error.stack);
        //     reject(error);
        // }
    });
};

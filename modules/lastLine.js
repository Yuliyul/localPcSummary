const fs = require('fs');
const path = require('path');
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
const readline = require('readline');
const Stream = require('stream');
// const { db_settings, php_log, fiscal_log, terminal_log } = require('../config');
const php_log = conf.php_log;
const fiscal_log = conf.fiscal_log;
const terminal_log = conf.terminal_log;
function getLastLine(logtype) {
    var fileName = '';
    switch (logtype) {
        case 'php-log':
            fileName = php_log;
            break;
        case 'fiscal':
            fileName = fiscal_log;
            break;
        case 'terminal':
            fileName = terminal_log;
            break;
    }
    return new Promise((resolve, reject) => {
        try {
            var stats = fs.statSync(fileName);
            var fileSizeInBytes = stats.size;
            //read last 2000 bytes
            let inStream = fs.createReadStream(fileName, {
                start: fileSizeInBytes - 2000,
                end: fileSizeInBytes,
            });
            let outStream = new Stream();

            let rl = readline.createInterface(inStream, outStream);
            let lastLine = [];
            rl.on('line', function (line) {
                switch (logtype) {
                    case 'php-log':
                        if (
                            line.includes('Fatal error') ||
                            line.includes('Warning')
                        )
                            lastLine.push(line);
                        break;
                    case 'fiscal':
                    case 'terminal':
                        if (line.includes('WARNING') || line.includes('ERROR'))
                            lastLine.push(line);
                        break;
                }
            });

            rl.on('error', reject);

            rl.on('close', function () {
                resolve(lastLine);
            });
        } catch (error) {
            console.error(error.message || error.stack);
            reject(error);
        }
    }).catch((error) => {
        console.log('caught', error.message);
    });
}
module.exports.getLastLine = getLastLine;

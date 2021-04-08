const fs = require('fs');
const { Logger } = require('logger');
const path = require('path');
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
const readline = require('readline');
const Stream = require('stream');
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
        var stats = fs.statSync(fileName);
        if (typeof stats != 'undefined') {
            var fileSizeInBytes = stats.size;
            //read last 2000 bytes
            if (fileSizeInBytes > 0) {
                let inStream = fs.createReadStream(fileName, {
                    start: fileSizeInBytes - 500,
                    end: fileSizeInBytes,
                });
                let outStream = new Stream();

                let rl = readline.createInterface(inStream, outStream);
                let lastLine = [];
                rl.on('line', function (line) {
                    console.log('readline->', line);
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
                            if (
                                line.includes('WARNING') ||
                                line.includes('ERROR')
                            )
                                lastLine.push(line);
                            break;
                    }
                });
                rl.on('error', reject(`error on ${fileName}`));
                rl.on('close', function () {
                    console.log('lastLine->', lastLine);
                    resolve(lastLine);
                });
            }
        } else reject('Problem reading ', fileName);
    });
}
module.exports.getLastLine = getLastLine;

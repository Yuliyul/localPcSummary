const fs = require('fs');
const readline = require('readline');
const Stream = require('stream');

exports.getLastLine = (fileName, minLength, logtype) => {
    var stats = fs.statSync(fileName);
    var fileSizeInBytes = stats.size;
    //read last 2000 bytes
    let inStream = fs.createReadStream(fileName, {
        start: fileSizeInBytes - 2000,
        end: fileSizeInBytes,
    });
    let outStream = new Stream();
    return new Promise((resolve, reject) => {
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
            }
            // if (line.length >= minLength) {
            //     lastLine = line;
            // }
        });

        rl.on('error', reject);

        rl.on('close', function () {
            resolve(lastLine);
        });
    });
};

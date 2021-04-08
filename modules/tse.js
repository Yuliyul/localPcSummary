const fs = require('fs');
const path = require('path');
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
const tse_profile = conf.tse_profile;

function getTSE() {
    var fileName = tse_profile;
    return new Promise((resolve, reject) => {
        // try {
        var obj = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        if (typeof obj != 'undefined' && typeof obj.Sign_require != 'undefined')
            resolve(obj.Sign_require);
        else reject('cannot get TSE settings');
        // } catch (error) {
        //     console.error(error.message || error.stack);
        //     reject(error);
        // }
    });
}
module.exports.getTSE = getTSE;

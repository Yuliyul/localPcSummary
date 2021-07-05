const NetworkSpeed = require('network-speed'); // ES5
const fs = require('fs');
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
const downurl =
    conf.downurl + '/kasses/downspeed' ||
    'http://eu.httpbin.org/stream-bytes/50000000';
const testNetworkSpeed = new NetworkSpeed();

async function getNetworkDownloadSpeed() {
    const baseUrl = downurl;
    const fileSizeInBytes = 50000000;
    try {
        const speed = await testNetworkSpeed
            .checkDownloadSpeed(baseUrl, fileSizeInBytes)
            .catch((error) => {
                console.log('checkDownloadSpeed', error.message || error.stack);
            });
        return speed;
    } catch (error) {
        console.log(
            'checkDownloadSpeed',
            console.error(error.message || error.stack)
        );
    }
}

async function getNetworkUploadSpeed() {
    const options = {
        // hostname: 'localhost:3005',
        hostname: 'https://service-portal-be.hosting7-p.tn-rechenzentrum1.de',
        // port: 443,
        path: '/kasses/upspeed',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const fileSizeInBytes = 2000000;
    try {
        const speed = await testNetworkSpeed
            .checkUploadSpeed(options, fileSizeInBytes)
            .catch((error) => {
                console.log('checkUploadSpeed', error.message || error.stack);
            });
        console.log('Uploadspeed');
        console.log(speed);
        return speed;
    } catch (error) {
        console.log(console.error(error.message || error.stack));
    }
}
module.exports = { getNetworkDownloadSpeed, getNetworkUploadSpeed };

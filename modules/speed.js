const NetworkSpeed = require('network-speed'); // ES5
const testNetworkSpeed = new NetworkSpeed();

async function getNetworkDownloadSpeed() {
    const baseUrl = 'http://eu.httpbin.org/stream-bytes/50000000';
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
        hostname: 'www.google.com',
        port: 80,
        path: '/catchers/544b09b4599c1d0200000289',
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
                console.log('testNetworkSpeed', error.message || error.stack);
            });
        return speed;
    } catch (error) {
        console.log(console.error(error.message || error.stack));
    }
}
module.exports = { getNetworkDownloadSpeed, getNetworkUploadSpeed };

const localtunnel = require('localtunnel');
const os = require('os');
const checkDiskSpace = require('check-disk-space');
const pretty = require('prettysize');
const NetworkSpeed = require('network-speed'); // ES5
const testNetworkSpeed = new NetworkSpeed();

const {
    getConnection,
    getMysqlVersion,
    getKasseAndDomain,
    getDomainName,
} = require('./db');
const { getLastLine } = require('./lastLine');
const { getExtIP } = require('./ip');
async function getSummary() {
    //return new Promise((resolve, reject) => {
    try {
        const PCSummary = {};
        PCSummary.platform = os.platform();
        PCSummary.osname = os.type();
        PCSummary.arch = os.arch();
        PCSummary.uptime = os.uptime();
        PCSummary.freesysmem = pretty(os.freemem());
        PCSummary.totalmem = pretty(os.totalmem());
        PCSummary.cpu = os.cpus()[0].model;
        const conf = await getKasseAndDomain();
        PCSummary.domainID = conf.domainId;
        PCSummary.kasse = conf.kasseid;

        const dbConn = await getConnection();
        const mysqlVersion = await getMysqlVersion(dbConn);
        PCSummary.domainName = await getDomainName(dbConn, conf.domainId);
        PCSummary.mysqlversion = mysqlVersion;

        const diskSpace = await checkDiskSpace('C:');
        PCSummary.diskСSpace = pretty(diskSpace.size);
        PCSummary.diskСFreeSpace = pretty(diskSpace.free);
        await getExtIP().then((res) => {
            PCSummary.extip = res;
        });
        await getLastLine('php-log').then((res) => {
            PCSummary.phpLastLine = res;
        });
        await getLastLine('terminal').then((res) => {
            PCSummary.terminalLastLine = res;
        });
        await getLastLine('fiscal').then((res) => {
            PCSummary.FiscalLastLine = res;
        });
        if (
            typeof (process.tunnel != undefined) &&
            typeof (process.tunnel.closed != undefined) &&
            process.tunnel.closed == true
        ) {
            process.tunnel = await localtunnel({ port: 3000 });
        }
        PCSummary.externalUrl = process.tunnel.url;
        if (typeof process.ffVersion != 'undefined')
            PCSummary.FFVersion = process.ffVersion.browser.version;
        if (typeof process.chVersion != 'undefined')
            PCSummary.ChVersion = process.chVersion.browser.version;

        return PCSummary;
    } catch (e) {
        console.log(e);
        // reject(e);
    }
    //});
}
module.exports.getSummary = getSummary;

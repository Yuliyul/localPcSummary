const localtunnel = require('localtunnel');
const os = require('os');
const checkDiskSpace = require('check-disk-space');
const pretty = require('prettysize');
const si = require('systeminformation');
const {
    getConnection,
    getMysqlVersion,
    getKasseAndDomain,
    getDomainName,
    closeConnection,
} = require('./db');
const fs = require('fs');
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
const PORT = process.env.PORT || conf.app_port;
const { getLastLine } = require('./lastLine');
const { getExtIP } = require('./ip');
const { getTSE } = require('./tse');
const { getNetworkDownloadSpeed, getNetworkUploadSpeed } = require('./speed');
const { getChromeVersion, getFFVersion } = require('./browsers');
const PCSummary = {};

async function getSummary() {
    PCSummary.platform = os.platform();
    PCSummary.osname = os.type();
    PCSummary.arch = os.arch();
    PCSummary.uptime = os.uptime();
    PCSummary.freesysmem = pretty(os.freemem());
    PCSummary.totalmem = pretty(os.totalmem());
    PCSummary.cpu = os.cpus()[0].model;

    const diskSpace = await checkDiskSpace('C:').catch((error) => {
        console.log('checkDiskSpace', error);
    });
    PCSummary.diskСSpace = pretty(diskSpace.size);
    PCSummary.diskСFreeSpace = pretty(diskSpace.free);
    let extip = await getExtIP().catch((error) => {
        console.log('getExtIP', error);
    });
    PCSummary.extip = extip;
    let uploadSpeed = await getNetworkUploadSpeed().catch((error) => {
        console.log('getNetworkUploadSpeed', error);
    });
    if (typeof uploadSpeed != 'undefined') PCSummary.uploadSpeed = uploadSpeed;
    let downSpeed = await getNetworkDownloadSpeed().catch((error) => {
        console.log('getNetworkDownloadSpeed', error);
    });
    if (typeof downSpeed != 'undefined') PCSummary.downSpeed = downSpeed;
    if (
        typeof (process.tunnel != undefined) &&
        typeof (process.tunnel.closed != undefined) &&
        process.tunnel.closed == true
    ) {
        process.tunnel = await localtunnel({ port: PORT });
    }
    PCSummary.externalUrl = process.tunnel.url;
    PCSummary.FFVersion = await getFFVersion().catch((error) => {
        console.log('getFFVersion', error);
    });
    PCSummary.ChVersion = await getChromeVersion().catch((error) => {
        console.log('getFFVersion', error);
    });
    let printers = await si.printer().catch((error) => {
        console.log('printer', error);
    });
    if (printers.length > 0) {
        let defaultPrinter = printers.filter(
            (printer) => printer.default == true
        );
        PCSummary.printer = defaultPrinter;
    }

    const conf = await getKasseAndDomain().catch((error) => {
        console.log('getKasseAndDomain', error);
    });
    if (typeof conf != 'undefined') {
        PCSummary.domainID = conf.domainId;
        PCSummary.kasse = conf.kasseid;
    }

    const dbConn = await getConnection().catch((error) => {
        console.log('getConnection', error);
    });
    const mysqlVersion = await getMysqlVersion(dbConn).catch((error) => {
        console.log('getConnection', error);
    });
    // PCSummary.domainName = await getDomainName(dbConn, conf.domainId).catch(
    //     (error) => {
    //         console.log('getDomainName', error);
    //     }
    // );
    PCSummary.mysqlversion = mysqlVersion;
    await closeConnection(dbConn);
    PCSummary.tseEFRType = await getTSE().catch((error) => {
        console.log('getTSE', error);
    });
    // try {
    //     let getphpLastLine = await getLastLine('php-log');
    //     PCSummary.phpLastLine = getphpLastLine;
    // } catch (error) {
    //     console.log('try-catch php -> ', error);
    // }

    let phpLastLine = await getLastLine('php-log')
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log('php-log error', error);
        });
    PCSummary.phpLastLine = phpLastLine;
    let terminalLastLine = await getLastLine('terminal').catch((error) => {
        console.log('terminal error', error);
    });
    PCSummary.terminalLastLine = terminalLastLine;
    let FiscalLastLine = await getLastLine('fiscal').catch((error) => {
        console.log('fiscal error', error);
    });
    PCSummary.FiscalLastLine = FiscalLastLine;
    return PCSummary;
}
module.exports.getSummary = getSummary;

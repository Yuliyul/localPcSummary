const express = require('express');
const fs = require('fs');
const path = require('path');
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
const expresshbs = require('express-handlebars');
const app = express();
const pino = require('pino');
const expressPino = require('express-pino-logger');

const logger = pino(
    { level: process.env.LOG_LEVEL || 'error' },
    pino.destination('C:/localmachine/error.log')
);
const expressLogger = expressPino({ logger });
app.use(expressLogger);

const localtunnel = require('localtunnel');
const hbs = expresshbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});
const axios = require('axios');
const PORT = process.env.PORT || conf.app_port;
const CrudRoutes = require('./routes/crud');
// var logger = require('logger').createLogger('development.log');

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(CrudRoutes);
app.use(express.static(path.join(__dirname, 'public')));
const { getSummary } = require('./modules/summary');
var qs = require('qs');

// process.on('beforeExit', (code) => {
//     // Can make asynchronous calls
//     setTimeout(() => {
//         console.log(`Process will exit with code: ${code}`);
//         logger.info(`Process will exit with code: ${code}`);
//         process.exit(code);
//     }, 100);
// });

process.on('exit', (code) => {
    // Only synchronous calls
    logger.info(`Process exited with code: ${code}`);
    console.log(`Process exited with code: ${code}`);
});
process.on('warning', (warning) => {
    logger.info(`warning: ${warning}`);
});
process.on('unhandledRejection', (reason, promise) => {
    logger.info('Unhandled Rejection at:', promise, 'reason:', reason);
});

logger.info(`start logging`);
fs.writeFileSync('C:/localmachine/pid.txt', process.pid.toString());
async function mainCode() {
    const summary = await getSummary();
    console.log(summary);
    var data = qs.stringify(summary);
    var postConfig = {
        method: 'post',
        url: conf.server_url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
    };
    try {
        let response = await axios(postConfig);
    } catch (err) {
        console.log(err);
    }
}
app.listen(PORT, () => {
    console.log('listen');
    logger.debug(`our port: ${PORT}`);
});

(async () => {
    process.tunnel = await localtunnel({ port: PORT });
})();
setInterval(mainCode, conf.frequency);

const express = require('express');
const PORT = process.env.PORT || 3000;
const expresshbs = require('express-handlebars');
const app = express();
const localtunnel = require('localtunnel');
const hbs = expresshbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});
const path = require('path');
const open = require('open');

const CrudRoutes = require('./routes/crud');
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(CrudRoutes);
app.use(express.static(path.join(__dirname, 'public')));
const PCSummary = require('./modules/summary');
function start() {
    try {
        app.listen(PORT, () => {
            console.log('Server started');
            console.log(PCSummary);
        });
        open('localhost:3000', { app: 'firefox' });
    } catch (e) {
        console.log(e);
    }
}
start();

(async () => {
    const tunnel = await localtunnel({ port: 3000 });

    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    tunnel.url;
    console.log(tunnel.url);
    tunnel.on('close', () => {
        // tunnels are closed
    });
})();

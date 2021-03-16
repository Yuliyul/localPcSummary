const express = require('express');
const fs = require('fs');
const path = require('path');
const conf = JSON.parse(fs.readFileSync('C:/localmachine/conf.json', 'utf8'));
const expresshbs = require('express-handlebars');
const app = express();
const localtunnel = require('localtunnel');
const hbs = expresshbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});
const axios = require('axios');
const PORT = process.env.PORT || conf.app_port;
const open = require('open');
const CrudRoutes = require('./routes/crud');

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(CrudRoutes);
app.use(express.static(path.join(__dirname, 'public')));
const { getSummary } = require('./modules/summary');
var qs = require('qs');

async function mainCode() {
    const summary = await getSummary();
    // console.log(summary);
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
        // console.log(JSON.stringify(response.data));
    } catch (err) {
        console.log(err);
    }
}
app.listen(PORT, () => {
    console.log('listen');
});

(async () => {
    /*await open('localhost:' + PORT + '/ff', {
        app: ['firefox', '-private-window'],
    });
    await open('http://localhost:' + PORT + '/ch', {
        app: ['chrome', '--incognito'],
    });*/
    process.tunnel = await localtunnel({ port: PORT });
})();
setInterval(mainCode, 60000);

const { Router } = require('express');
const router = Router();
const Bowser = require('bowser');
const { getSummary } = require('../modules/summary');
router.get('/', async (req, res) => {
    async function run() {
        const summary = await getSummary();
        // console.log(summary);
        res.render('index', {
            title: 'Summary',
            summary: summary,
        });
    }
    run();
});
// router.get('/ff', async (req, res) => {
//     process.ffVersion = Bowser.parse(req.headers['user-agent']);
//     res.sendStatus(200);
// });
// router.get('/ch', async (req, res) => {
//     process.chVersion = Bowser.parse(req.headers['user-agent']);
//     res.sendStatus(200);
// });
router.post('/restart', async (req, res) => {
    var child = require('child_process').exec(
        'shutdown -r',
        function (err, stdout, stderr) {
            console.log('err: ', err, 'stdout: ', stdout, 'stderr: ', stderr);
            if (err !== null) {
                console.log('exec error: ' + err);
            }
        }
    );
});
module.exports = router;

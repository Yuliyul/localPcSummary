const { Router } = require('express');
const router = Router();
const Bowser = require('bowser');
router.get('/', async (req, res) => {
    console.log(Bowser.parse(req.headers['user-agent']));
    res.render('index', {
        title: 'Summary',
    });
});
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

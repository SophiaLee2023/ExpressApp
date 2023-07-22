var express = require('express');
var router = express.Router();

var https = require('https');
const key = '';

async function httpsRequest(ip) {
    var promise = new Promise((resolve, reject) => {
        var request = https.request(`https://api.ip2location.io/?key=${key}&ip=${ip}`, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data = data + chunk.toString();
            });

            response.on('end', () => {
                resolve(JSON.parse(data));
            });
        })

        request.on('error', (error) => {
            console.log('An error occured while completing the https request', error);
        });

        request.end();
    });

    return await promise;
}

router.get('/', function(req, res, next) {
    res.render('ip');
});

router.post('/', async function(req, res, next) {
    let input = req.body['ip']
    let location = await httpsRequest(input);
    console.log(location);

    if(location['error']) {
        res.render('ip', { ip: input, error: location['error']['error_message']});
    } else {
        res.render('ip', { ip: input, state: location['region_name'], city: location['city_name'], latitude: location['latitude'], longitude: location['longitude'] });
    }
});

module.exports = router;

'use strict';

const getIP = require('external-ip')();

module.exports.getExtIP = function getExtIP() {
    return new Promise((resolve, reject) => {
        try {
            getIP((err, ip) => {
                if (err) {
                    // every service in the list has failed
                    reject(err);
                }
                resolve(ip);
            });
        } catch (error) {
            reject(error);
        }
    }).catch((error) => {
        console.log('caught', error.message);
    });
};

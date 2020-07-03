const pyaircontrol = require('./pyaircontrol.js');

class HttpClientLegacy {

    constructor(host, timeout = 5000, key = null) {
        this.client = new pyaircontrol('http', host, timeout);
    }

    setValues = function(values) {
        this.client.setValues(values);
    }

    getStatus = function() {
        return this.client.getStatus();
    }

    getFirmware = function() {
        return this.client.getFirmware();
    }

    getFilters = function() {
        return this.client.getFilters();
    }

    getWifi = function() {
        return this.client.getWifi();
    }

}

module.exports = HttpClientLegacy;
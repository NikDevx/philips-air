const pyaircontrol = require('./pyaircontrol.js');

class HttpClientLegacy {

    constructor(host, timeout = 5000, key = null) {
        this.client = new pyaircontrol('coap', host, timeout);
    }

    setValues = function(values) {
        this.client.setValues(values);
    }

    getStatus = function() {
        return this.client.getStatus();
    }

    getFirmware = function() {
        return this.getStatus();
    }

    getFilters = function() {
        return this.getStatus();
    }

    getWifi = function() {
        return null;
    }

}

module.exports = HttpClientLegacy;
const process = require('child_process');

class pyaircontrol {

    constructor(protocol, host, timeout) {
        this.protocol = protocol;
        this.host = host;
        this.options = {};
        this.options.cwd = __dirname;
        this.options.timeout = timeout;
    }

    setValues = function(values) {
        var setOptions = {};
        setOptions.timeout = this.options.timeout;
        setOptions.input = JSON.stringify(values);
        process.execFileSync('python3', [__dirname + '/pyaircontrol.py', '--ipaddr', this.host, '--protocol', this.protocol, '--set'], setOptions);
    }

    #getData = function(type) {
        var output = process.execFileSync('python3', [__dirname + '/pyaircontrol.py', '--ipaddr', this.host, '--protocol', this.protocol, type], this.options).toString();
        var start = output.indexOf('{');
        var end = output.indexOf('}', start);
        if (start > 0 && end > 0) {
            output = output.substr(start, end - start + 1);
            return JSON.parse(output);
        } else {
            return null;
        }
    }

    getStatus = function() {
        return this.#getData('--status');
    }

    getFirmware = function() {
        return this.#getData('--firmware');
    }

    getFilters = function() {
        return this.#getData('--filters');
    }

    getWifi = function() {
        return this.#getData('--wifi');
    }

}

module.exports = pyaircontrol;
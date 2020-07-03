const axios = require('axios');
const aesjs = require('aes-js');
const crypto = require('crypto');
const deasync = require('deasync-promise');
const pkcs7 = require('pkcs7-padding');

const G = 'A4D1CBD5C3FD34126765A442EFB99905F8104DD258AC507FD6406CFF14266D31266FEA1E5C41564B777E690F5504F213160217B4B01B886A5E91547F9E2749F4D7FBD7D3B9A92EE1909D0D2263F80A76A6A24C087A091F531DBF0A0169B6A28AD662A4D18E73AFA32D779D5918D08BC8858F4DCEF97C2A24855E6EEB22B3B2E5';
const P = 'B10B8F96A080E01DDE92DE5EAE5D54EC52C99FBCFB06A3C69A6A9DCA52D23B616073E28675A23D189838EF1E2EE652C013ECB4AEA906112324975C3CD49B83BFACCBDD7D90C4BD7098488E9C219A73724EFFD6FAE5644738FAA31A4FF55BCCC0A151AF5F0DC8B4BD45BF37DF365C1A65E68CFDA76D4DA708DF1FB2BC2E4A4371';

bytesToString = function(array) {
    var decode = '';
    array.forEach(element => decode += String.fromCharCode(element));
    return decode;
}

aesDecrypt = function(data, key) {
    var iv = Buffer.from("00000000000000000000000000000000", 'hex');
    var crypto = new aesjs.ModeOfOperation.cbc(key, iv);
    return crypto.decrypt(Buffer.from(data, 'hex'));
}

decrypt = function(data, key) {
    var payload = Buffer.from(data, 'base64');
    var decrypt = bytesToString(aesDecrypt(payload, key).slice(2));
    return pkcs7.unpad(decrypt);
}

encrypt = function(data, key) {
    data = pkcs7.pad('AA' + data);
    var iv = Buffer.from("00000000000000000000000000000000", 'hex');
    var crypto = new aesjs.ModeOfOperation.cbc(key, iv);
    var encrypt = crypto.encrypt(Buffer.from(data, 'ascii'));
    return Buffer.from(encrypt).toString('base64');
}

class HttpClient {

    constructor(host, timeout = 5000, key = null) {
        this.host = host;
        if (key == null) {
            this.#getKey();
        } else {
            this.key = key;
        }
        this.config = {};
        this.config.timeout = timeout;
    }

    #getKey = function() {
        var a = crypto.createDiffieHellman(P, 'hex', G, 'hex');
        a.generateKeys();
        var data = {
            'diffie': a.getPublicKey('hex')
        };
        var dh = deasync(axios.put('http://' + this.host + '/di/v1/products/0/security', data, this.config)).data;
        var s = a.computeSecret(dh['hellman'], 'hex', 'hex');
        var s_bytes = Buffer.from(s, 'hex').slice(0, 16);
        this.key = aesDecrypt(dh['key'], s_bytes).slice(0, 16);
        return this.key;
    }

    setValues = function(values) {
        var encrypted = encrypt(JSON.stringify(values), this.key);

        deasync(axios.put('http://' + this.host + '/di/v1/products/1/air', encrypted, this.config));
    }

    #getOnce = function(endpoint) {
        var resp = deasync(axios.get('http://' + this.host + endpoint, this.config)).data;
        return decrypt(resp, this.key);
    }

    #getData = function(endpoint) {
        var data = '';
        try {
            data = this.#getOnce(endpoint);
        } catch (err) {
            this.#getKey();
            data = this.#getOnce(endpoint);
        }
        return JSON.parse(data);
    }

    getStatus = function() {
        return this.#getData('/di/v1/products/1/air');
    }

    getFirmware = function() {
        return this.#getData('/di/v1/products/0/firmware');
    }

    getFilters = function() {
        return this.#getData('/di/v1/products/1/fltsts');
    }

    getWifi = function() {
        return this.#getData('/di/v1/products/0/wifi');
    }

}

module.exports = HttpClient;
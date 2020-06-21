# philips-air
NodeJS library for controlling Philips Air Purifiers, based on work done by [py-air-control](https://github.com/rgerganov/py-air-control).

## Usage
To use the API, install the `philips-air` package from npm, and `require` it with the correct protocol type for your device:

| Protocol   | Require                           |
|------------|-----------------------------------|
| HTTP       | require('philips-air').HttpClient |
| Plain CoAP | _Coming Soon_                     |
| CoAP       | _Coming Soon_                     |

### constructor(host, key = null, timeout = 5000)
Instantiates the class. `host` is the IP address or hostname of the purifier, `key` is the session key (will automatically request a new one if null), `timeout` is the timeout in milliseconds for all requests.

### getKey()
Requests a new session key. Will also return the session key.

### setValues(values)
Sends `values` object to the purifier.

### getStatus()
Returns an object representing the current status of the purifier.

### getFirmware()
Returns an object representing information on the firmware of the purifier.

### getFilters()
Returns an object representing the air filters in the purifier.

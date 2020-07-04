# philips-air
[![npm](https://img.shields.io/npm/v/philips-air) ![npm](https://img.shields.io/npm/dt/philips-air)](https://www.npmjs.com/package/philips-air)

NodeJS library for controlling Philips Air Purifiers, based on work done by [py-air-control](https://github.com/rgerganov/py-air-control).

## Prerequisites
If you wish to use either of the CoAP protocols, you'll need to have py-air-control installed.

1. Install pip and git using `sudo apt install python3-pip git`.
2. Install py-air-control using `sudo pip3 install py-air-control`.
3. Update CoAPthon3 using `sudo pip3 install -U git+https://github.com/Tanganelli/CoAPthon3@89d5173`.

## Usage
To use the API, install the `philips-air` package from npm, and `require` it with the correct protocol type for your device:

| Protocol   | Require                                |
|------------|----------------------------------------|
| HTTP       | require('philips-air').HttpClient      |
| Plain CoAP | require('philips-air').PlainCoapClient |
| CoAP       | require('philips-air').CoapClient      |

### constructor(host, timeout = 5000, key = null)
Instantiates the class. `host` is the IP address or hostname of the purifier, `timeout` is the timeout in milliseconds for all requests, `key` is the session key (will automatically request a new one if null, only used with HTTP protocol).

### setValues(values)
Sends `values` object to the purifier.

### getStatus()
Returns an object representing the current status of the purifier.

### getWifi()
Returns an object representing the wifi settings of the purifier. Only supported with HTTP protocol.

### getFirmware()
Returns an object representing information on the firmware of the purifier.

### getFilters()
Returns an object representing the air filters in the purifier.

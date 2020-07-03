#!/usr/bin/env python3

import argparse
import sys
import pprint
import json

from pyairctrl.coap_client import CoAPAirClient
from pyairctrl.http_client import HTTPAirClient
from pyairctrl.plain_coap_client import PlainCoAPAirClient


class CoAPCli:
    def __init__(self, host, port=5683):
        self._client = CoAPAirClient(host, port, False)

    def get_status(self):
        status = self._client.get_status(False)
        return json.dumps(status)

    def set_values(self, values):
        self._client.set_values(values, False)

    def get_firmware(self):
        status = self._client.get_firmware()
        return json.dumps(status)

    def get_filters(self):
        status = self._client.get_filters()
        return json.dumps(status)

    def get_wifi(self):
        return None


class HTTPAirCli:
    def __init__(self, host):
        self._client = HTTPAirClient(host)

    def set_values(self, values):
        values = self._client.set_values(values)

    def get_status(self):
        status = self._client.get_status()
        return json.dumps(status)

    def get_firmware(self):
        firmware = self._client.get_firmware()
        return json.dumps(firmware)

    def get_filters(self):
        filters = self._client.get_filters()
        return json.dumps(filters)

    def get_wifi(self):
        wifi = self._client.get_wifi()
        return json.dumps(wifi)


class PlainCoAPAirCli:
    def __init__(self, host, port=5683):
        self._client = PlainCoAPAirClient(host, port)

    def set_values(self, values):
        self._client.set_values(values, False)

    def get_status(self):
        status = self._client.get_status(False)
        return json.dumps(status)

    def get_firmware(self):
        status = self._client.get_firmware()
        return json.dumps(status)

    def get_filters(self):
        status = self._client.get_filters()
        return json.dumps(status)

    def get_wifi(self):
        return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ipaddr", help="IP address of air purifier")
    parser.add_argument("--protocol", help="set the communication protocol")
    parser.add_argument("--set", help="set values", action="store_true")
    parser.add_argument("--status", help="read status", action="store_true")
    parser.add_argument("--firmware", help="read firmware", action="store_true")
    parser.add_argument("--filters", help="read filters status", action="store_true")
    parser.add_argument("--wifi", help="read wifi options", action="store_true")
    args = parser.parse_args()

    if args.protocol == "http":
        c = HTTPAirCli(args.ipaddr)
    elif args.protocol == "plain_coap":
        c = PlainCoAPAirCli(args.ipaddr)
    elif args.protocol == "coap":
        c = CoAPCli(args.ipaddr)
    else:
        sys.exit(0)

    if args.status:
        print(c.get_status())
        sys.exit(0)
    if args.firmware:
        print(c.get_firmware())
        sys.exit(0)
    if args.filters:
        print(c.get_filters())
        sys.exit(0)
    if args.wifi:
        print(c.get_wifi())
        sys.exit(0)

    if args.set:
        if args.protocol == "http":
            c.get_status()
        values = json.loads(input())
        c.set_values(values)

if __name__ == "__main__":
    main()
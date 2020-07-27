import pyaircontrol from './pyaircontrol';
import { AirClient } from './AirClient';

export class HttpClientLegacy implements AirClient {
  private readonly client: pyaircontrol;

  constructor(host: string, timeout = 5000) {
    this.client = new pyaircontrol('http', host, timeout);
  }

  setValues(values: any): void { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    this.client.setValues(values);
  }

  getStatus(): any {
    return this.client.getStatus();
  }

  getFirmware(): any {
    return this.client.getFirmware();
  }

  getFilters(): any {
    return this.client.getFilters();
  }

  getWifi(): any {
    return this.client.getWifi();
  }
}
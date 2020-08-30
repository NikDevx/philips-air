import pyaircontrol from './pyaircontrol';
import { AirClient } from './AirClient';

export class HttpClientLegacy implements AirClient {
  private readonly client: pyaircontrol;

  constructor(host: string, timeout = 5000) {
    this.client = new pyaircontrol('http', host, timeout);
  }

  setValues(values: any): Promise<void> { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    return this.client.setValues(values);
  }

  getStatus(): Promise<any> {
    return this.client.getStatus();
  }

  getFirmware(): Promise<any> {
    return this.client.getFirmware();
  }

  getFilters(): Promise<any> {
    return this.client.getFilters();
  }

  getWifi(): Promise<any> {
    return this.client.getWifi();
  }
}
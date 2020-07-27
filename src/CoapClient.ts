import pyaircontrol from './pyaircontrol';
import { AirClient } from './AirClient';

export class CoapClient implements AirClient {
  private readonly client: pyaircontrol;

  constructor(host: string, timeout = 5000) { // eslint-disable-line @typescript-eslint/no-unused-vars
    this.client = new pyaircontrol('coap', host, timeout);
  }

  setValues(values: any): void { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    this.client.setValues(values);
  }

  getStatus(): any {
    return this.client.getStatus();
  }

  getFirmware(): any {
    return this.getStatus();
  }

  getFilters(): any {
    return this.getStatus();
  }

  getWifi(): any {
    return null;
  }
}
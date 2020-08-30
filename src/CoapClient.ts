import pyaircontrol from './pyaircontrol';
import { AirClient } from './AirClient';

export class CoapClient implements AirClient {
  private readonly client: pyaircontrol;

  constructor(host: string, timeout = 5000) { // eslint-disable-line @typescript-eslint/no-unused-vars
    this.client = new pyaircontrol('coap', host, timeout);
  }

  setValues(values: any): Promise<void> { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    return this.client.setValues(values);
  }

  getStatus(): Promise<any> {
    return this.client.getStatus();
  }

  getFirmware(): Promise<any> {
    return this.getStatus();
  }

  getFilters(): Promise<any> {
    return this.getStatus();
  }

  getWifi(): Promise<any> {
    return new Promise<any>((resolve) => {
      resolve(undefined);
    });
  }
}
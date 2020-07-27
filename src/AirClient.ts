export interface AirClient {
  setValues(values: any): void;
  getStatus(): any;
  getFirmware(): any;
  getFilters(): any;
  getWifi(): any;
}
export interface AirClient {
  setValues(values: any): Promise<void>;
  getStatus(): Promise<any>;
  getFirmware(): Promise<any>;
  getFilters(): Promise<any>;
  getWifi(): Promise<any>;
}
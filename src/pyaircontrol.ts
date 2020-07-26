import process from 'child_process';
import pathjs from 'path';

export default class pyaircontrol {
  private readonly protocol: string;
  private readonly host: string;
  private readonly timeout: number;
  private readonly path: string;

  constructor(protocol: string, host: string, timeout: number) {
    this.protocol = protocol;
    this.host = host;
    this.timeout = timeout;
    this.path = pathjs.resolve(__dirname, '..');
  }

  setValues(values: any): void { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    const setOptions = {
      cwd: this.path,
      timeout: this.timeout,
      input: JSON.stringify(values)
    };
    process.execFileSync('python3', [this.path + '/pyaircontrol.py', '--ipaddr', this.host, '--protocol', this.protocol, '--set'], setOptions);
  }

  private getData(type: string): any {
    const options = {
      cwd: this.path,
      timeout: this.timeout
    };
    let output = process.execFileSync('python3', [this.path + '/pyaircontrol.py', '--ipaddr', this.host, '--protocol', this.protocol, type], options).toString();
    const start = output.indexOf('{');
    const end = output.indexOf('}', start);
    if (start >= 0 && end > 0) {
      output = output.substr(start, end - start + 1);
      return JSON.parse(output);
    } else {
      return null;
    }
  }

  getStatus(): any {
    return this.getData('--status');
  }

  getFirmware(): any {
    return this.getData('--firmware');
  }

  getFilters(): any {
    return this.getData('--filters');
  }

  getWifi(): any {
    return this.getData('--wifi');
  }
}
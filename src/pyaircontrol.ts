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

  private execPromise(args: Array<string>, input?: string): Promise<string> {
    const options: process.ExecFileSyncOptionsWithStringEncoding = {
      cwd: this.path,
      timeout: this.timeout,
      encoding: 'utf8'
    };
    if (input) {
      options.input = input;
    }
    return new Promise<string>((resolve, reject) => {
      try {
        resolve(process.execFileSync('python3', args, options));
      } catch (err) {
        reject(err);
      }
    });
  }

  setValues(values: any): Promise<void> { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    return this.execPromise(
      [this.path + '/pyaircontrol.py',
        '--ipaddr', this.host,
        '--protocol', this.protocol,
        '--set'],
      JSON.stringify(values))
      .then(() => {
        return;
      });
  }

  private getData(type: string): Promise<any> {
    return this.execPromise(
      [this.path + '/pyaircontrol.py',
        '--ipaddr', this.host,
        '--protocol', this.protocol,
        type])
      .then((output) => {
        const start = output.indexOf('{');
        const end = output.indexOf('}', start);
        if (start >= 0 && end > 0) {
          const json = output.substr(start, end - start + 1);
          return JSON.parse(json);
        } else {
          return undefined;
        }
      });
  }

  getStatus(): Promise<any> {
    return this.getData('--status');
  }

  getFirmware(): Promise<any> {
    return this.getData('--firmware');
  }

  getFilters(): Promise<any> {
    return this.getData('--filters');
  }

  getWifi(): Promise<any> {
    return this.getData('--wifi');
  }
}
import aesjs from 'aes-js';
import axios from 'axios';
import crypto from 'crypto';
import pkcs7 from 'pkcs7-padding';
import { AirClient } from './AirClient';

const G = 'A4D1CBD5C3FD34126765A442EFB99905F8104DD258AC507FD6406CFF14266D31266FEA1E5C41564B777E690F5504F213160217B4B01B886A5E91547F9E2749F4D7FBD7D3B9A92EE1909D0D2263F80A76A6A24C087A091F531DBF0A0169B6A28AD662A4D18E73AFA32D779D5918D08BC8858F4DCEF97C2A24855E6EEB22B3B2E5';
const P = 'B10B8F96A080E01DDE92DE5EAE5D54EC52C99FBCFB06A3C69A6A9DCA52D23B616073E28675A23D189838EF1E2EE652C013ECB4AEA906112324975C3CD49B83BFACCBDD7D90C4BD7098488E9C219A73724EFFD6FAE5644738FAA31A4FF55BCCC0A151AF5F0DC8B4BD45BF37DF365C1A65E68CFDA76D4DA708DF1FB2BC2E4A4371';

function bytesToString(array: Uint8Array): string {
  let decode = '';
  array.forEach((element: number) => decode += String.fromCharCode(element));
  return decode;
}

function aesDecrypt(data: any, key: Uint8Array): Uint8Array {
  const iv = Buffer.from('00000000000000000000000000000000', 'hex');
  const crypto = new aesjs.ModeOfOperation.cbc(key, iv);
  return crypto.decrypt(Buffer.from(data, 'hex'));
}

function decrypt(data: string, key: Uint8Array): string {
  const payload = Buffer.from(data, 'base64');
  const decrypt = bytesToString(aesDecrypt(payload, key).slice(2));
  return pkcs7.unpad(decrypt);
}

function encrypt(data: string, key: Uint8Array): string {
  data = pkcs7.pad('AA' + data, 16);
  const iv = Buffer.from('00000000000000000000000000000000', 'hex');
  const crypto = new aesjs.ModeOfOperation.cbc(key, iv);
  const encrypt = crypto.encrypt(Buffer.from(data, 'ascii'));
  return Buffer.from(encrypt).toString('base64');
}

export class HttpClient implements AirClient {
  private readonly host: string;
  private readonly timeout: number;
  key?: Uint8Array;

  constructor(host: string, timeout = 5000, key?: Uint8Array) {
    this.host = host;
    if (key) {
      this.key = key;
    }
    this.timeout = timeout;
  }

  private async getKey(): Promise<Uint8Array> {
    const a = crypto.createDiffieHellman(P, 'hex', G, 'hex');
    a.generateKeys();
    const response = await axios.put('http://' + this.host + '/di/v1/products/0/security', {
      'diffie': a.getPublicKey('hex')
    }, {
      timeout: this.timeout
    });
    const dh = response.data;
    const s = a.computeSecret(dh['hellman'], 'hex', 'hex');
    const s_bytes = Buffer.from(s, 'hex').slice(0, 16);
    this.key = aesDecrypt(dh['key'], s_bytes).slice(0, 16);
    return this.key;
  }

  async setValues(values: any): Promise<void> { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    if (!this.key) {
      this.key = await this.getKey();
    }
    const encrypted = encrypt(JSON.stringify(values), this.key);
    await axios.put('http://' + this.host + '/di/v1/products/1/air', encrypted, {
      timeout: this.timeout
    });
  }

  private async getOnce(endpoint: string): Promise<string> {
    if (!this.key) {
      this.key = await this.getKey();
    }
    const response = await axios.get('http://' + this.host + endpoint, {
      timeout: this.timeout
    });
    return decrypt(response.data, this.key);
  }

  private getData(endpoint: string): Promise<any> {
    return this.getOnce(endpoint)
      .catch(() => {
        return this.getKey();
      })
      .then(() => {
        return this.getOnce(endpoint);
      })
      .then((data) => {
        return JSON.parse(data);
      });
  }

  getStatus(): Promise<any> {
    return this.getData('/di/v1/products/1/air');
  }

  getFirmware(): Promise<any> {
    return this.getData('/di/v1/products/0/firmware');
  }

  getFilters(): Promise<any> {
    return this.getData('/di/v1/products/1/fltsts');
  }

  getWifi(): Promise<any> {
    return this.getData('/di/v1/products/0/wifi');
  }
}
import aesjs from 'aes-js';
import crypto from 'crypto';
import pkcs7 from 'pkcs7-padding';
import { AirClient } from './AirClient';
const fetch = require('sync-fetch'); // eslint-disable-line @typescript-eslint/no-var-requires

const G = 'A4D1CBD5C3FD34126765A442EFB99905F8104DD258AC507FD6406CFF14266D31266FEA1E5C41564B777E690F5504F213160217B4B01B886A5E91547F9E2749F4D7FBD7D3B9A92EE1909D0D2263F80A76A6A24C087A091F531DBF0A0169B6A28AD662A4D18E73AFA32D779D5918D08BC8858F4DCEF97C2A24855E6EEB22B3B2E5';
const P = 'B10B8F96A080E01DDE92DE5EAE5D54EC52C99FBCFB06A3C69A6A9DCA52D23B616073E28675A23D189838EF1E2EE652C013ECB4AEA906112324975C3CD49B83BFACCBDD7D90C4BD7098488E9C219A73724EFFD6FAE5644738FAA31A4FF55BCCC0A151AF5F0DC8B4BD45BF37DF365C1A65E68CFDA76D4DA708DF1FB2BC2E4A4371';

function bytesToString(array: Uint8Array): string {
  let decode = '';
  array.forEach((element: number) => decode += String.fromCharCode(element));
  return decode;
}

function aesDecrypt(data: string, key: Uint8Array): Uint8Array {
  const iv = Buffer.from('00000000000000000000000000000000', 'hex');
  const crypto = new aesjs.ModeOfOperation.cbc(key, iv);
  return crypto.decrypt(Buffer.from(data, 'hex'));
}

function decrypt(data: string, key: Uint8Array): string {
  const payload = Buffer.from(data, 'base64');
  const decrypt = bytesToString(aesDecrypt(payload.toString(), key).slice(2));
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
  private key: Uint8Array;

  constructor(host: string, timeout = 5000, key?: Uint8Array) {
    this.host = host;
    if (!key) {
      this.key = this.getKey();
    } else {
      this.key = key;
    }
    this.timeout = timeout;
  }

  private getKey(): Uint8Array {
    const a = crypto.createDiffieHellman(P, 'hex', G, 'hex');
    a.generateKeys();
    const data = {
      'diffie': a.getPublicKey('hex')
    };
    const dh = fetch('http://' + this.host + '/di/v1/products/0/security', {
      method: 'PUT',
      body: JSON.stringify(data),
      timeout: this.timeout
    }).json();
    const s = a.computeSecret(dh['hellman'], 'hex', 'hex');
    const s_bytes = Buffer.from(s, 'hex').slice(0, 16);
    this.key = aesDecrypt(dh['key'], s_bytes).slice(0, 16);
    return this.key;
  }

  setValues(values: any): void { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    const encrypted = encrypt(JSON.stringify(values), this.key);
    fetch('http://' + this.host + '/di/v1/products/1/air', {
      method: 'PUT',
      body: encrypted,
      timeout: this.timeout
    });
  }

  private getOnce(endpoint: string): string {
    const resp = fetch('http://' + this.host + endpoint, {
      timeout: this.timeout
    }).text();
    return decrypt(resp, this.key);
  }

  private getData(endpoint: string): any {
    let data = '';
    try {
      data = this.getOnce(endpoint);
    } catch (err) {
      this.getKey();
      data = this.getOnce(endpoint);
    }
    return JSON.parse(data);
  }

  getStatus(): any {
    return this.getData('/di/v1/products/1/air');
  }

  getFirmware(): any {
    return this.getData('/di/v1/products/0/firmware');
  }

  getFilters(): any {
    return this.getData('/di/v1/products/1/fltsts');
  }

  getWifi(): any {
    return this.getData('/di/v1/products/0/wifi');
  }
}
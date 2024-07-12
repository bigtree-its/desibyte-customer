import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private SECRET = "uPfVxw5nykjNf9hF";

  constructor() { }

  encrypt(text: string) {
    const key = CryptoJS.enc.Utf8.parse(this.SECRET);
    const encrypted = CryptoJS.AES.encrypt(this.encoder(text), key, { iv: key });
    return encrypted;
  }

  decrypt(encrypted: string) {
    const encodedKey = CryptoJS.enc.Utf8.parse(this.SECRET);
    const bytes = CryptoJS.AES.decrypt(encrypted, encodedKey, { iv: encodedKey });
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return decodeURIComponent(plaintext);
  }
  
  private encoder(str) {
    let encoder = new TextEncoder();
    let byteArray = encoder.encode(str);
    let cryptoJsEncoded = CryptoJS.enc.Utf8.parse(str);
    return cryptoJsEncoded;
  }
}

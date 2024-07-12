import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private cryptoService: CryptoService) {
  }

  public saveData(key: string, value: string) {
    var encrypted = this.cryptoService.encrypt(value)
    localStorage.setItem(key,encrypted);
  }

  public getData(key: string) {
    let data = localStorage.getItem(key) || "";
    var decrypted = this.cryptoService.decrypt(data);
    return decrypted;
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    console.log('Clearing all items from storage..')
    localStorage.clear
  }
}

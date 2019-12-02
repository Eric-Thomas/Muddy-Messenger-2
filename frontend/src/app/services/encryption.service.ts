import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ApiService } from "src/app/services/api.service";
import { UserService } from "src/app/services/user.service";
import {throwError} from 'rxjs';
var primes = require('primes');

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private _secretKey = Math.floor(Math.random()*10); //TODO: too large causes overflow
  private _secretKeyString = this._secretKey.toString();
  private _sharedSecret;

  constructor(
    private apiService: ApiService,
    private userService: UserService) { 
  }

  // Diffie-Hellman Key exchange with server
  dhKeyExchange(username) {

    // We generate primes g and n, send them and our public key to server and receive their public key
    // In the end, shared secret is available to us, server, but not eve
    let primeNums = primes(100)
    let g = primeNums[Math.floor(Math.random()*primeNums.length)];
    let n = primeNums[Math.floor(Math.random()*primeNums.length)];

    // A = our public key
    let A = Math.pow(g, this._secretKey) % n

    // Send our public key to server and get theirs
    let r = this.apiService.dhKeyExchange(A, g, n, username)
    .subscribe(resp => {
      if (resp["status"] == 200){

        // Calculate shared secret
        this._sharedSecret = Math.pow(resp["public_key"], this._secretKey) % n
        console.log('shared secret: ' + this._sharedSecret)
        return resp;
      }
      return throwError(resp["message"])
    });
  }

  /**
   * AES, DES, 3DES encrpytion and decryption
   */
  AESEncrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this._secretKeyString).toString();
  }

  AESDecrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this._secretKeyString).toString(CryptoJS.enc.Utf8);
  }

  DESEncrypt(value : string) : string{
    return CryptoJS.DES.encrypt(value, this._secretKeyString).toString();
  }

  DESDecrypt(textToDecrypt : string){
    return CryptoJS.DES.decrypt(textToDecrypt, this._secretKeyString).toString(CryptoJS.enc.Utf8);
  }

  TDESEncrypt(value : string) : string{
    return CryptoJS.TripleDES.encrypt(value, this._secretKeyString).toString();
  }

  TDESDecrypt(textToDecrypt : string){
    return CryptoJS.TripleDES.decrypt(textToDecrypt, this._secretKeyString).toString(CryptoJS.enc.Utf8);
  }
}
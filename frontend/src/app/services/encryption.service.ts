import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ApiService } from "src/app/services/api.service";
import { UserService } from "src/app/services/user.service";
import {throwError} from 'rxjs';
var primes = require('primes');
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private _secretKey = Math.floor(Math.random()*10); //TODO: too large causes overflow
  private _secretKeyString = this._secretKey.toString();
  private _sharedSecret;

  private _RSApublic
  private _RSAprivate
  private _serverRSAPublic

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
        return {'shared secret' :this._sharedSecret, 'ID': resp["message_id"]};
      }
      return throwError(resp["message"])
    });
  }

  /**
   * Synchronsly generates RSA public/private keys and gets server's public key
   */
  RSAKeyGen(username) {
    var keypair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001});
    this._RSAprivate = keypair.privateKey;
    this._RSApublic = keypair.publicKey;

    // convert a Forge public key to PEM-format
    var pem = forge.pki.publicKeyToPem(this._RSApublic);

    // TODO: send public key to server and get servers public key
    let r = this.apiService.rsaKeyExchange(pem, username)
    .subscribe(resp => {
      if (resp["status"] == 200){
        return resp;
      }
      return throwError(resp["message"])
    });
  }

  /**
   * Synchronsly decrypts ciphertext using the client's private key
   */
  RSADecrypt(ciphertext) {
    return this._RSAprivate.decrypt(ciphertext);
  }

  /**
   * Synchronsly encrypts plaintext using server's public key
   */
  RSAEncrypt(plaintext="hello world") {
    return this._serverRSAPublic.encrypt(plaintext);    
  }

}
import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import {throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import * as cryptojs from 'crypto-js';
import * as forge from 'node-forge';
import * as bcrypt from 'bcryptjs';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient,
    private encryptionService: EncryptionService) {
   }

  login(username : String, password : String){
    let url = AppConstants.apiURL + "/authenticate/" + username;
    return this.httpClient.get(url).pipe(map(resp => {
      if (resp["status"] == 200 && bcrypt.compareSync(password, resp["password"])){//successful login
        return resp;
      }
      return this.error(resp["message"]); 
    }));
  }

  createUser(username: String, password: String){
    let url = AppConstants.apiURL + "/user";
    let payload = {
      "user_name": username,
      "password": this.hash(password, username)
    }
    return this.httpClient.post(url, payload)
    .pipe(map(resp => {
      if (resp["status"] == 201){//successful signup
        return resp;
      }
      return this.error(resp["message"]);
    }));
  }

  async sendMessage(sender: string, receiver: string, message: string, algorithm : string, sharedKey: string){
    let message_info = await this.encryptionService.dhKeyExchange(sender);
    let encryptedMessage = this.encryptMessage(message, algorithm, message_info["shared secret"]);
    let url = AppConstants.apiURL + "/send";
    let payload ={
      "sender": sender,
      "receiver": receiver,
      "message": encryptedMessage,
      "encryption" : algorithm,
      "ID": message_info["ID"]
    };
    return this.httpClient.post(url, payload);
  }
  getUsers() {
    let url = AppConstants.apiURL + "/users";
    return this.httpClient.get(url);

  }
  getMessages(receiver: string){
    let url = AppConstants.apiURL + "/user/" + receiver + "/messages";
    return this.httpClient.get(url);
  }
  
  dhKeyExchange(publicKey: Number, g: Number, n: Number, username: String) {
    let url = AppConstants.apiURL + '/dhExchange'; 
    let payload = {
      "g": g, 
      "n": n, 
      "client_public_key": publicKey,
      "username" : username,
    };

    return this.httpClient.post(url, payload)
  }

  rsaKeyExchange(publicKey, username: String) {
    console.log('Key: ' + publicKey)

    let url = AppConstants.apiURL + '/rsa'; 
    let payload = {
      "client_public_key": publicKey,
      "username" : username,
    };

    return this.httpClient.post(url, payload)
  }

  error(message) {
    return throwError(message);
  }

  hash(plaintext : any, salt: any) {
    let saltValue = bcrypt.genSaltSync(10);
    console.log(bcrypt.hashSync(plaintext, saltValue));
    return bcrypt.hashSync(plaintext, saltValue);

    //return cryptojs.PBKDF2(plaintext + salt).toString();  
  }

  encryptMessage(plaintext: any, algorithm : string, sharedKey : any) {
    switch(algorithm){
      case 'RSA': {
        //TODO: Implement RSA Encryption
        return plaintext;
      }
      case 'AES': {
        return cryptojs.AES.encrypt(plaintext, sharedKey).toString();
      }
      case 'DES': {
        return cryptojs.DES.encrypt(plaintext, sharedKey).toString();
      }
      case '3DES': {
        return cryptojs.TripleDES.encrypt(plaintext, sharedKey).toString();
      }
      default : {
        //TODO: Return error
        break;
      }
    }
  }

  decryptMessage(plaintext: any, algorithm : string, sharedKey : any) {
    //TODO: Produce key from user input
    switch(algorithm){
      case 'RSA': {
        //TODO: Implement RSA Decryption
        return plaintext;
      }
      case 'AES': {
        return cryptojs.AES.decrypt(plaintext, sharedKey).toString(cryptojs.enc.Utf8);
      }
      case 'DES': {
        return cryptojs.DES.decrypt(plaintext, sharedKey).toString(cryptojs.enc.Utf8);
      }
      case '3DES': {
        return cryptojs.TripleDES.decrypt(plaintext, sharedKey).toString(cryptojs.enc.Utf8);
      }
      default : {
        //TODO: Return error
        break;
      }
    }
  }
}

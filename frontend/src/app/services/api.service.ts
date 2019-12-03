import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import {throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import * as cryptojs from 'crypto-js';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  saltRounds = 10;

  constructor(private httpClient: HttpClient) {
   }

  login(username : String, password : String){
    let url = AppConstants.apiURL + "/authenticate/" + username;
    return this.httpClient.get(url).pipe(map(resp => {
      if (resp["status"] == 200 && resp["password"] == this.hash(password, username)){//successful login
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

  sendMessage(sender: string, receiver: string, message: string, algorithm : string, sharedKey: string){
    let encryptedMessage = this.encryptMessage(message, algorithm, sharedKey);
    let url = AppConstants.apiURL + "/send";
    let payload ={
      "sender": sender,
      "receiver": receiver,
      "message": encryptedMessage,
      "encryption" : algorithm
    };
    this.httpClient.post(url, payload).subscribe();
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
    return cryptojs.MD5(plaintext + salt).toString();
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
        return cryptojs.AES.decrypt(plaintext, sharedKey).toString();
      }
      case 'DES': {
        return cryptojs.DES.decrypt(plaintext, sharedKey).toString();
      }
      case '3DES': {
        return cryptojs.TripleDES.decrypt(plaintext, sharedKey).toString();
      }
      default : {
        //TODO: Return error
        break;
      }
    }
  }
}

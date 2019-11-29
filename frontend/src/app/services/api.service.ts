import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import {throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import * as cryptojs from 'crypto-js';

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

  sendMessage(sender: string, receiver: string, message: string, algorithm : string){
    let encryptedMessage = this.encryptMessage(message, algorithm);
    let url = AppConstants.apiURL + "/send";
    let payload ={
      "sender": sender,
      "receiver": receiver,
      "message": encryptedMessage
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
  
  error(message: string){
    return throwError(message);
  }

  hash(plaintext : any, salt: any) {
    return cryptojs.MD5(plaintext + salt).toString();
  }

  encryptMessage(plaintext: any, algorithm : string) {
    //TODO: Produce key from user input
    let key = "key";
    switch(algorithm){
      case 'RSA': {
        //TODO: Implement RSA Encryption
        return plaintext;
      }
      case 'AES': {
        return cryptojs.AES.encrypt(plaintext, key).toString();
      }
      case 'DES': {
        return cryptojs.DES.encrypt(plaintext, key).toString();
      }
      case '3DES': {
        return cryptojs.TripleDES.encrypt(plaintext, key).toString();
      }
      default : {
        //TODO: Return error
        break;
      }
    }
  }
}

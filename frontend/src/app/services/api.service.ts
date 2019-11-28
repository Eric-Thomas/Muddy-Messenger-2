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
      console.log("db pass" + resp["password"])
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
      console.log(resp)
      if (resp["status"] == 201){//successful signup
        return resp;
      }
      return this.error(resp["message"]);
    }));
  }

  error(message : String) {
    return throwError(message);
  }

  hash(plaintext : any, salt: any) {
    return cryptojs.MD5(plaintext + salt).toString();
  }
}

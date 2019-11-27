import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import {throwError} from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  passwordHash;
  constructor(private httpClient: HttpClient) {
     //this.passwordHash = require('password-hash');
   }

  login(username : String, password : String){
    let url = AppConstants.apiURL + "/authenticate/" + username;
    return this.httpClient.get(url).pipe(map(resp => {
      console.log("db pass" + resp["password"])
      if (resp["status"] == 200 && resp["password"] == password){//successful login
        return resp;
      }
      return this.error(resp["message"]);
    }));
  }

  createUser(username: String, password: String){
    let url = AppConstants.apiURL + "/user";
    let payload = {
      "user_name": username,
      "password": password
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

  sendMessage(sender: string, receiver: string, message: string){
    let url = AppConstants.apiURL + "/send";
    let payload ={
      "sender": sender,
      "receiver": receiver,
      "message": message
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
}

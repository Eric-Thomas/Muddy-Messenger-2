import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
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
    let url = AppConstants.apiURL + "/authenticate";
    let payload = {
      "user_name": username,
      "password": password
    }

    return this.httpClient.post(url, payload)
      .pipe(map(user => {
        console.log(user);
        return user;
      }));
  }

  createUser(username: String, password: String){
    let url = AppConstants.apiURL + "/user";
    let payload = {
      "user_name": username,
      "password": password
    }
    return this.httpClient.post(url, payload)
    .pipe(map(user => {
      console.log(user);
      return user;
    }));
  }
}

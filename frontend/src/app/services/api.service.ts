import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  login(username : String, password : String){
    let url = AppConstants.apiURL + "/user";
    let payload = {
      "user_name": username,
      "password": password
    }
    return this.httpClient.post(url, payload)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem('currentUser', JSON.stringify(user));
        // this.currentUserSubject.next(user);
        return user;
      }));
  }
  createUser(userName: string){
    let url = AppConstants.apiURL + "/user";
    let payload = {
      "user_name": userName
    }
    this.httpClient.post(url, payload).subscribe(resp => console.log(resp));
  }
}

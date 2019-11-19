import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  createUser(userName: string){
    let url = AppConstants.apiURL + "/user";
    let payload = {
      "user_name": userName
    }
    this.httpClient.post(url, payload).subscribe(resp => console.log(resp));
  }
}

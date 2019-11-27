import { Injectable } from "@angular/core";
import { AppConstants } from "../app.constants";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  createUser(userName: string) {
    let url = AppConstants.apiURL + "/user";
    let payload = {
      user_name: userName
    };
    this.httpClient.post(url, payload).subscribe(resp => console.log(resp));
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

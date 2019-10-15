import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userName = '';

  constructor() { }

  createUser(name: string) {
    this.userName = name;
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private userName = '';
  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  createUser() {
    //TODO: Use API service to see if user alread exists if not create one
    this.userService.createUser(this.userName);
    this.router.navigateByUrl('/send'); 
  }

}

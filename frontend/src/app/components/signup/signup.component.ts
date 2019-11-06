import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private userName ='';
  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  createUser() {
    //TODO: Use API service to see if user alread exists if not create one
    this.userService.createUser(this.userName);
    this.router.navigateByUrl('/inbox'); 
  }
}

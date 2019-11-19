import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private userName ='';
  private password ='';
  private loginForm;
  constructor(private userService: UserService,
    private apiServiece :ApiService,
    private router: Router,) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username' : new FormControl(this.userName,
        [Validators.required]),
      'password' : new FormControl(this.password,
        [Validators.required,
        Validators.minLength(7)])
    });
  }

  createUser() {
    this.apiServiece.createUser(this.userName);
    this.userService.createUser(this.userName);
    // this.router.navigateByUrl('/inbox'); 
  }
}

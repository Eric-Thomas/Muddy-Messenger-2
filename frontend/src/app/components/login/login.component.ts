import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private userService: UserService,
    private apiServiece :ApiService,
    private router: Router,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls }

  onSubmit() {
    this.submitted = true;
    //stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    //this.apiServiece.createUser(this.f.username.value);
    this.userService.createUser(this.f.username.value);
    this.router.navigateByUrl('/inbox'); 
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private registerForm: FormGroup;
  private submitted = false;
  private invalidLogin = false;

  constructor(private userService: UserService,
    private apiService :ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    ){ }

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
    this.invalidLogin = false;
    this.apiService.login(this.f.username.value.toLowerCase(), this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if(data["status"] == 200){
            this.userService.createUser(this.f.username.value.toLowerCase());
            this.router.navigateByUrl('/inbox'); 
          }
          this.invalidLogin = true;
        },
        error => {
        });
  }
}

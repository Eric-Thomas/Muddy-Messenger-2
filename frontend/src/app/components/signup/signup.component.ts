import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { first, map } from "rxjs/operators";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  private registerForm: FormGroup;
  submitted = false;
  usernameTaken = false;

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    //stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.usernameTaken = false;

    this.apiService
      .createUser(this.f.username.value.toLowerCase(), this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data["status"] == 201) {
            this.userService.createUser(this.f.username.value.toLowerCase());
            this.router.navigateByUrl("/inbox");
          }
          this.usernameTaken = true;
        },
        err => {}
      );
  }
}

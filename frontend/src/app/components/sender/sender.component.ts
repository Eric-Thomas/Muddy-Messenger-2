import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { FormGroup, FormBuilder , Validators} from '@angular/forms';

@Component({
  selector: "app-sender",
  templateUrl: "./sender.component.html",
  styleUrls: ["./sender.component.css"]
})
export class SenderComponent implements OnInit {
  private userName = "";
  private users: any;
  private algorithms : string[] = ['RSA', 'AES', 'DES', '3DES'];
  private messageForm : FormGroup;
  private submitted = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.userName = this.userService.getUserName();
    if (!this.userName) {
      this.router.navigateByUrl("");
    }
    this.apiService.getUsers().subscribe(resp => {
      this.users = resp["users"];
    });
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
      recipient: ['', [Validators.required]],
      algorithm : ['RSA']
    });
  }

  sendMessage() {
    this.submitted = true;
    this.apiService.sendMessage(this.userName, this.f.recipient.value, this.f.message.value, this.f.algorithm.value);
  }

  // convenience getter for easy access to form fields
  get f() { return this.messageForm.controls }
}

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
  private recipient: string = "";
  private algorithms : string[] = ['RSA', 'AES', 'DES', '3DES'];
  private chosenAlgorithm : string = "";
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
      console.log('users');
      console.log(resp["users"]);
      this.users = resp["users"];
    });
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
      recipient: ['', [Validators.required]]
    });
  }

  selectRecipient(name) {
    this.recipient = name;
  }

  selectAlgorithm(algorithm){
    this.chosenAlgorithm = algorithm;
  }

  sendMessage() {
    //TODO: Encrypt and send to backend
    this.submitted = true;
    var message = (<HTMLInputElement>document.getElementById("message")).value;
    this.apiService.sendMessage(this.userName, this.recipient, message);
  }

  // convenience getter for easy access to form fields
  get f() { return this.messageForm.controls }

}

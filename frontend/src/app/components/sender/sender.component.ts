import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EncryptionService } from "src/app/services/encryption.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { first } from "rxjs/operators";

@Component({
  selector: "app-sender",
  templateUrl: "./sender.component.html",
  styleUrls: ["./sender.component.css"]
})
export class SenderComponent implements OnInit {
  private userName = "";
  private users: any;
  private algorithms: string[] = ["AES", "DES", "3DES"];
  private messageForm: FormGroup;
  private submitted = false;
  private successfulSend = false;
  private invalidRecipient = false;
  private closeResult: string;
  private encryptedMessage: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private _EncryptionService: EncryptionService
  ) {}

  ngOnInit() {
    this.userName = this.userService.getUserName();
    if (!this.userName) {
      this.router.navigateByUrl("");
    }
    this.userName = this.userService.getUserName();
    this.apiService.getUsers().subscribe(resp => {
      this.users = resp["users"];
    });
    this.messageForm = this.formBuilder.group({
      message: ["", Validators.required],
      recipient: ["", [Validators.required]],
      sharedKey: ["", [Validators.required]],
      algorithm: ["AES"]
    });
  }

  sendMessage() {
    this.submitted = true;
    this.apiService
      .sendMessage(
        this.userName,
        this.f.recipient.value,
        this.f.message.value,
        this.f.algorithm.value,
        this.f.sharedKey.value
      )
      .then(
        data => {
          if (data["status"] == 201) {
            this.encryptedMessage = data["encryptedMessage"];
            this.successfulSend = true;
            this.invalidRecipient = false;
            this.clearTextFields();
          } else if (data["status"] == 403) {
            this.invalidRecipient = true;
          }
        },
        error => {}
      );
  }

  goToInbox() {
    this.router.navigateByUrl("/inbox");
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.messageForm.controls;
  }

  clearTextFields() {
    (<HTMLInputElement>document.getElementById("message")).value = "";
    (<HTMLInputElement>document.getElementById("recipient")).value = "";
    if (<HTMLInputElement>document.getElementById("sharedKey") != null) {
      (<HTMLInputElement>document.getElementById("sharedKey")).value = "";
    }
  }
}

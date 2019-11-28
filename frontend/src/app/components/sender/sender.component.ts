import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { EncryptionService } from 'src/app/services/encryption.service'; 

@Component({
  selector: "app-sender",
  templateUrl: "./sender.component.html",
  styleUrls: ["./sender.component.css"]
})
export class SenderComponent implements OnInit {
  private userName = "";
  private users = ["Eric", "Duddy", "Mikey"];
  constructor(
    private userService: UserService,
    private router: Router,
    private apiService: ApiService,
    private _EncryptionService: EncryptionService
  ) {}

  ngOnInit() {
    this.userName = this.userService.getUserName();
    // if (!this.userName) {
    //   this.router.navigateByUrl("");
    // }
    // this.apiService.getUsers().subscribe(resp => {
    //   this.users = resp["users"];
    // });
  }

  sendMessage() {
    //TODO: Encrypt and send to backend
    let encryptedText = this._EncryptionService.AESEncrypt("Hello World");
    let decryptedText = this._EncryptionService.AESDecrypt(encryptedText);
  }
}

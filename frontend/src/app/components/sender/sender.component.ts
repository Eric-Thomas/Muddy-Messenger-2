import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-sender",
  templateUrl: "./sender.component.html",
  styleUrls: ["./sender.component.css"]
})
export class SenderComponent implements OnInit {
  private userName = "";
  private users: any;
  constructor(
    private userService: UserService,
    private router: Router,
    private apiService: ApiService
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
  }

  sendMessage() {
    //TODO: Encrypt and send to backend
  }
}

import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sender",
  templateUrl: "./sender.component.html",
  styleUrls: ["./sender.component.css"]
})
export class SenderComponent implements OnInit {
  private userName = "";
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userName = this.userService.getUserName();
    if (!this.userName) {
      this.router.navigateByUrl("");
    }
  }

  sendMessage() {
    //TODO: Encrypt and send to backend
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {

  private userName = '';
  private encryption = '';
  private submit = false;
  private encryptionError = false;
  private successMessage = '';
  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.userName = this.userService.getUserName();
    if (!this.userName) {
      this.router.navigateByUrl('');
    }
  }

  setEncryptionOption(option: string){
    this.encryption = option;
    this.encryptionError = false;
  }

  sendMessage(){
    //TODO: Send message with api service and use httpinterceptor to encrypt
    if (!this.encryption){
      this.encryptionError = true;
    } else {
      (<HTMLTextAreaElement>document.getElementById('message')).value = '';
      this.successMessage = 'Message sent';
    }
  }

}

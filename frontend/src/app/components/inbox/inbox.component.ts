import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  private userName = '';
  private messages: any;
  constructor(private userService: UserService,
    private router:Router,
    private apiService: ApiService) { 
    
  }

  ngOnInit() {
    this.userName = this.userService.getUserName();
    if (!this.userName) {
      this.router.navigateByUrl('');
    }
    this.getMessages();
  }

  goToSend(){
    this.router.navigateByUrl("/send");
  }

  getMessages(){
    this.apiService.getMessages(this.userName).subscribe(resp => {
      console.log(resp);
      this.messages = resp["messages"];
    })
  }
}
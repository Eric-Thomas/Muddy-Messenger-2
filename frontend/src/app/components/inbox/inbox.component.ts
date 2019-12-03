import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ApiService } from 'src/app/services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import {MessageDialogComponent} from 'src/app/components/inbox/message.component';

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
    private apiService: ApiService,
    private dialog: MatDialog) { 
    
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
      this.messages = resp["messages"];
    })
  }

  openDialog(sender: string, message: string, encryption: string){
    console.log('h');
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    

    dialogConfig.data = {
      sender: sender,
      message: message,
      encryption: encryption
    };

    this.dialog.open(MessageDialogComponent, dialogConfig);
  }
}

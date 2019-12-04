import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ApiService } from 'src/app/services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageDialogComponent implements OnInit{
    private message: string;
    private sender: string;
    private encryption: string;
    private decryptedMessage: string;
    private decrypted = false;

    constructor(
        private dialogRef: MatDialogRef<MessageDialogComponent>,
        private apiService: ApiService,
        @Inject(MAT_DIALOG_DATA) data) {

        this.message = data.message;
        this.sender = data.sender;
        this.encryption = data.encryption;
    }

    ngOnInit(){   
    }

    close(){
        this.dialogRef.close();
    }

    decrypt(){
        //TODO:
        this.decryptedMessage = this.apiService.decryptMessage(this.message, this.encryption,'s5v8y/B?E(H+MbPeShVmYq3t6w9z$C&F');
        this.decrypted = true;
        console.log("message: " + this.message);
        console.log("sender: " + this.sender);
        console.log("encryption: " + this.encryption);
        console.log("decrypt: " + this.decryptedMessage);
    }
}
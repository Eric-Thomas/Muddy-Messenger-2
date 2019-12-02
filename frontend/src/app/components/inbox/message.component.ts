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

    constructor(
        private dialogRef: MatDialogRef<MessageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data) {

        this.message = data.message;
        this.sender = data.sender;
    }

    ngOnInit(){   
    }

    close(){
        this.dialogRef.close();
    }
}
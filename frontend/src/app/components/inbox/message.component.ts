import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { ApiService } from "src/app/services/api.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from "@angular/material/dialog";
import { EncryptionService } from "src/app/services/encryption.service";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.css"]
})
export class MessageDialogComponent implements OnInit {
  private message: string;
  private sender: string;
  private encryption: string;
  private decryptedMessage: string;
  private key: string;

  constructor(
    private dialogRef: MatDialogRef<MessageDialogComponent>,
    private apiService: ApiService,
    private encryptionService: EncryptionService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.message = data.message;
    this.sender = data.sender;
    this.encryption = data.encryption;
    this.key = data.key;
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  decrypt() {
    this.decryptedMessage = this.apiService.decryptMessage(
      this.message,
      this.encryption,
      this.key
    );
  }
}

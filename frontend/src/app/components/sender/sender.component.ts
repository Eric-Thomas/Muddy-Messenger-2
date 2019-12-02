import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { FormGroup, FormBuilder , Validators} from '@angular/forms';
import { EncryptionService } from 'src/app/services/encryption.service'; 
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

@Component({
  selector: "app-sender",
  templateUrl: "./sender.component.html",
  styleUrls: ["./sender.component.css"]
})
export class SenderComponent implements OnInit {
  private userName = "";
  private users: any;
  private algorithms : string[] = ['RSA', 'AES', 'DES', '3DES'];
  private messageForm : FormGroup;
  private submitted = false;
  private successfulSend = false;
  private closeResult: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private _EncryptionService: EncryptionService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.userName = this.userService.getUserName();
    if (!this.userName) {
      this.router.navigateByUrl("");
    }
    this.apiService.getUsers().subscribe(resp => {
      this.users = resp["users"];
    });
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
      recipient: ['', [Validators.required]],
      sharedKey: ['', [Validators.required]],
      algorithm : ['RSA']
    });

    // Gets shared private key with server
    this._EncryptionService.dhKeyExchange(this.userName);
  }

  sendMessage() {
    this.submitted = true;
    this.apiService.sendMessage(this.userName, this.f.recipient.value, this.f.message.value, this.f.algorithm.value, this.f.sharedKey.value)
    .subscribe(
      data => {
        if(data["status"] == 201){
          this.successfulSend = true;
        }
      },
      error => {
    });
  }

  goToInbox(){
    this.router.navigateByUrl("/inbox");
  }

  // convenience getter for easy access to form fields
  get f() { return this.messageForm.controls }

  open(content) {
    if(this.successfulSend){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}

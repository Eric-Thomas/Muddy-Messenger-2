import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private userName ='';
  constructor(private userService: UserService,
    private apiServiece :ApiService,
    private router: Router,) { }

  ngOnInit() {

  }

  createUser() {
    this.apiServiece.createUser(this.userName);
    this.userService.createUser(this.userName);
    // this.router.navigateByUrl('/inbox'); 
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { SenderComponent } from './components/sender/sender.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { HttpClientModule } from '@angular/common/http';
import { AppConstants } from './app.constants';
import { AlertComponent } from './components/alert/alert.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SenderModalComponent } from './components/sender-modal/sender-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SenderComponent,
    HomeComponent,
    SignupComponent,
    InboxComponent,
    AlertComponent,
    SenderModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

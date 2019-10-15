import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SenderComponent } from './components/sender/sender.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'send', component: SenderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

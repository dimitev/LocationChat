import { Component, OnInit } from '@angular/core';
import { ServerService } from '../server.service';
import { error } from 'util';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public registerToggle = false;
  public username: Text;
  public password: Text;
  public errorText: Text;
  constructor(
    private server: ServerService,
    private router: Router,
    private user: UsersService) { }

  ngOnInit() {
  }

  LogInClick() {
    this.errorText = null;
    this.server.checkCredentials({username: this.username, password: this.password}).then(responce=> {
      this.user.LogInUser(this.username.toString(),(responce as any).userId);
      this.router.navigate(['/chats']);
    },error=>{console.log("error: " + (this.errorText=error.error.status))});
  }
  RegisterClick() {
    this.errorText = null;
    this.server.createUser({username: this.username, password: this.password}).then(responce=> {
      this.registerToggle = false;
    },error=>{console.log("error: " + (this.errorText=error.error.status))});
  }
  RegisterToggleClick() {
    this.registerToggle = !this.registerToggle;
    this.errorText = null;
  }

}

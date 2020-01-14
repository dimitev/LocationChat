import { Component } from '@angular/core';
import { ServerService } from './server.service';
import { UsersService } from './users.service';
//import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'timeline-client';
  events: any[] = [];
  isAuthenticated: boolean;
  constructor(private server: ServerService,private user: UsersService)
  {

  }

  ngOnInit() {
    this.user.PrepareUser();
  }
}
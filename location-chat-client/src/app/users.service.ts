import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    public userId: number;
    public userName: string;
    public isAdmin: boolean;
    constructor(private cookie: CookieService,private router: Router) {
    }
    CheckIfUserIsLogged()
    {
        if(this.cookie.get("currentUserId"))
        {
          this.PrepareUser();
          return true;
        }
        this.router.navigate(['/']);
        console.log("userNotLoggedIn");
        return false;
    }
    LogInUser(userName: string, userId: number,admin: boolean)
    {
      if(!!userName && !!userId){
        this.userId=userId;
        this.userName=userName;
        this.isAdmin = admin;
        let valid = new Date();
        valid.setHours(valid.getHours()+1);
        this.cookie.set("currentUserName",userName, valid ,null,null,null,"Strict");
        this.cookie.set("currentUserId",userId.toString());
      }
    }
    LogOutUser()
    {
      this.userId=null;
      this.userName=null;
      this.isAdmin = false;
      this.cookie.deleteAll();
      this.router.navigate(['/']);
    }
    PrepareUser()
    {
      this.userId = +this.cookie.get("currentUserId");
      this.userName= this.cookie.get("currentUserName");

    }
}
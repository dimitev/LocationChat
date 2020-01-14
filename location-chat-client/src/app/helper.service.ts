import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

    constructor() {
    }
    TypeToImage(type: number)
    {
      switch(type){
        case 1: return "./assets/chatNormal.png";
        case 2: return "./assets/chatEvent.png";
        case 3: return "./assets/chatImportant.png";
        default: return "./assets/chatBubble.png";
      }
    }
}
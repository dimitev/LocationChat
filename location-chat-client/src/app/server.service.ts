import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

    constructor(private http: HttpClient) {
    }

    private async request(method: string, url: string, data?: any, parameters?:any) {
      const result = this.http.request(method, url, {
        body: data,
        params: parameters,
        responseType: 'json',
        observe: 'body',
        headers: {
          Authorization: 'Bearer'
        }
      });
      return new Promise((resolve, reject) => {
        result.subscribe(resolve, reject);
      });
    }

    getChats(parameters) {
      return this.request('GET', `${environment.serverUrl}/getChats`, null, parameters);
    }

    getChatRoom(parameters) {
      return this.request('GET', `${environment.serverUrl}/getChatRoom`, null, parameters);
    }

    getChatRoomChange(parameters) {
      return this.request('GET', `${environment.serverUrl}/getChatRoomChange`, null, parameters);
    }
    
    createUser(event) {
      return this.request('POST', `${environment.serverUrl}/createUser`, event);
    }

    commentOnPost(event) {
      return this.request('POST', `${environment.serverUrl}/commentOnPost`, event);
    }

    checkCredentials(event) {
      return this.request('POST', `${environment.serverUrl}/checkCredentials`, event);
    }

    createPost(event) {
      return this.request('POST', `${environment.serverUrl}/createPost`, event);
    }

    updateEvent(event) {
      return this.request('PUT', `${environment.serverUrl}/event/${event.id}`, event);
    }

    deletePost(event) {
      return this.request('DELETE', `${environment.serverUrl}/deletePost/${event.postId}`);
    }
}
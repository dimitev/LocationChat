import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ServerService } from '../server.service';
import { ChatComponent } from '../chat/chat.component';
import { UsersService } from '../users.service';
import { HelperService } from '../helper.service';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, AfterViewInit{

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  @ViewChild(ChatComponent, {static: false}) chat: ChatComponent;
  @ViewChild(AdminPanelComponent, {static: false}) adminPanel: AdminPanelComponent;
  map: google.maps.Map;
  newMarker: any;
  chatHeads = [];
  newChat = false;
  selectedChat = false;
  lat = 40.730610;
  lng = -73.935242;
  refreshTimer = null;
  lastClickCoordinates: any;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 12,
  };
  constructor(
    private server: ServerService,
    private user: UsersService,
    private helper: HelperService) { }

  ngOnInit() {
    this.user.CheckIfUserIsLogged();
  }
  ngAfterViewInit(){
    this.mapInitializer();
  }
  OpenAdminPanel()
  {
    this.adminPanel.dialogVisible = true;
    console.log("open admin");
  }
  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.map.addListener('dragstart', event=>{
      if(this.newMarker)
        this.newMarker.setMap(null);});

    this.map.addListener('click', event=>{
      if(this.newMarker)
        this.newMarker.setMap(null);
        this.lastClickCoordinates = {
          lat: event.latLng.lat(),
          lon: event.latLng.lng()
        }
      this.newMarker = new google.maps.Marker({
        position: event.latLng,
        map: this.map,
        icon: "./assets/chatBubble.png",
      });
      this.newMarker.addListener('click', event=> {
        this.user.CheckIfUserIsLogged();
        this.map.setZoom(19);
        this.map.setCenter(this.newMarker.getPosition());
        this.newChat = true;
      });
    });
    this.map.addListener('bounds_changed', event=>{
        this.MapMooved();        
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos =>{
        this.map.setCenter(new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude));
        this.map.setZoom(13);
      });
    }
  }
  MapMooved()
  {
    // debounce timer prevents processing of marker filters until map stops moving for 200ms
    
    this.user.CheckIfUserIsLogged();
    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.refreshTimer = setTimeout(() => {
      this.GetChats(this.map.getBounds());
    }, 200);
  }
  GetChats(bounds: google.maps.LatLngBounds)
  {
      this.server.getChats(
        {
          north: bounds.getNorthEast().lat(),
          east: bounds.getNorthEast().lng(),
          south: bounds.getSouthWest().lat(),
          west: bounds.getSouthWest().lng()
        }
        ).then(responce=> {
          var res=(responce as any);
          console.log(res.chats);
          this.CreateChatHeads(res.chats);
      },error=>{console.log("error: " + (error.error.status))});
  }
  CreateChatHeads(chats: any)
  {
    this.chatHeads.forEach(element => {
      element.setMap(null);
    });
    this.chatHeads=[];
      chats.forEach(chat => {
        var position = {lat: chat.lat, lng: chat.lon};
        var chatHead = new google.maps.Marker({
          position: position,
          map: this.map,
          icon: this.helper.TypeToImage(chat.type)
        });

        chatHead.addListener('click', event=> {
          this.chat.OpenChat(chat.id);
          this.user.CheckIfUserIsLogged();
        });
        this.chatHeads.push(chatHead);
      });
  }
  updateBubble()
  {
    console.log("update bubble");
    if(this.newMarker){
        this.newMarker.setMap(null);
    }
    this.MapMooved();
  }
}
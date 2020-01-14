import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServerService } from '../server.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.css']
})
export class NewChatComponent implements OnInit {

  @Input() dialogVisible: boolean;
  @Input() coordinates: any;
  @Output() dialogVisibleChange = new EventEmitter();
  selectedCategory = 1;
  description: Text;
  content: Text;
  errorText: Text;
  BackgroundClick(event: Event){
    let elementId: string = (event.target as Element).id;
    if(elementId == 'new-chat-background')
    {
      console.log("background click");
      this.dialogVisible = false;
      this.dialogVisibleChange.emit(this.dialogVisible);
    }
  }
  constructor(private server: ServerService,private user: UsersService) { }

  ngOnInit() {
  }
  CategoryClick(value: number) {
    this.selectedCategory = value;
  }
  SubmitClick(){
    this.server.createPost(
      {
        mainUser: this.user.userId, //TO DO
        description: this.description,
        content: this.content,
        lat: this.coordinates.lat,
        lon: this.coordinates.lon,
        type: this.selectedCategory
      }
        ).then(responce=> {
        this.dialogVisible=false;
        this.dialogVisibleChange.emit(this.dialogVisible);
    },error=>{console.log("error: " + (this.errorText=error.error.status))});
  }
}

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ServerService } from '../server.service';
import { UsersService } from '../users.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  @Output() dialogVisibleChange = new EventEmitter();
  errorText: Text;
  messageDelete:Text;
  postDelete:Text;
  userDelete:Text;
  dialogVisible: boolean;
  BackgroundClick(event: Event){
    let elementId: string = (event.target as Element).id;
    if(elementId == 'admin-background')
    {
      console.log("background click");
      this.CloseDialog();
    }
  }
  CloseDialog()
  {
    this.dialogVisible = false;
    this.dialogVisibleChange.emit(this.dialogVisible);
  }
  constructor(
    private server: ServerService,
    private user: UsersService,
    public helper: HelperService
    ) { }
  DeleteGroupClick()
  {
    this.server.deletePost(
      {postId: this.postDelete}
      ).then(responce=> {
        var res=(responce as any);
        this.postDelete = null;
        console.log(res);
    },error=>{
      console.log("error: " + (error.error.status));
    });
  }
  DeleteMessageClick()
  {
    this.server.deleteMessage(
      {messageId: this.messageDelete}
      ).then(responce=> {
        var res=(responce as any);
        this.messageDelete = null;
        console.log(res);
    },error=>{
      console.log("error: " + (error.error.status));
    });
  }
  DeleteUserClick()
  {
    this.server.deleteUser(
      {username: this.userDelete}
      ).then(responce=> {
        var res=(responce as any);
        this.userDelete = null;
        console.log(res);
    },error=>{
      console.log("error: " + (error.error.status));
    });
  }
  ngOnInit() {
  }

}

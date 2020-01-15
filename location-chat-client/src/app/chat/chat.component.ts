import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServerService } from '../server.service';
import { interval } from 'rxjs';
import { UsersService } from '../users.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() coordinates: any;
  @Output() dialogVisibleChange = new EventEmitter();
  description: Text;
  content: Text;
  errorText: Text;
  dialogVisible: boolean;
  comments: any[];
  mainChat: any;
  currentChatRoomId: number;
  chatResponce: string;
  refreshTimer: any;
  delVisible = false;
  BackgroundClick(event: Event){
    let elementId: string = (event.target as Element).id;
    if(elementId == 'chat-background')
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
    public user: UsersService,
    public helper: HelperService
    ) { }

  ngOnInit() {
    this.refreshTimer = interval(2000)
    .subscribe((val) => { 
      if(this.dialogVisible){
        this.CheckChatUpdate(); 
      }
    });
  }
  CheckChatUpdate()
  {
    this.server.getChatRoomChange(
      {chatId: this.currentChatRoomId}
      ).then(responce=> {
        var res=(responce as any)[0].count;
        if(res != this.comments.length){
          console.log(res);
          this.GetChatInfo();
        }
    },error=>{
      console.log("error: " + (error.error.status));
    });
  }
  ngOnDestroy()
  {
    this.refreshTimer.unsubscribe();
  }
  OpenChat(chatId: number){
    this.currentChatRoomId = chatId;
      this.GetChatInfo();
  }
  DeletePost()
  {
    this.server.deletePost(
      {postId: this.currentChatRoomId}
      ).then(responce=> {
        var res=(responce as any);
        this.CloseDialog();
        this.mainChat = null;
        this.comments = null;
        this.delVisible = false;
        console.log(res);
    },error=>{
      console.log("error: " + (error.error.status));
    });
  }
  GetChatInfo()
  {
    this.server.getChatRoom(
      {chatId: this.currentChatRoomId}
      ).then(responce=> {
        this.dialogVisible = true;
        var res=(responce as any);
        this.mainChat = res.mainChat;
        this.comments = res.chats;
        this.delVisible = this.mainChat.mainUser == this.user.userId;
    },error=>{
      console.log("error: " + (error.error.status));
    });
  }
  SubmitClick(){
    this.server.commentOnPost(
      {
        postId: this.currentChatRoomId,
        userId: this.user.userId,
        comment: this.chatResponce
      }
        ).then(responce=> {
          this.chatResponce = "";
          this.GetChatInfo();
    },error=>{console.log("error: " + (this.errorText=error.error.status))});
  }
}

import { Component, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.scss']
})
export class CustomerPageComponent implements OnDestroy {
  message:any;
  msgArr: any=[];
  sub: Subscription;
  userEmail:any;
  userId: any;
  constructor(private chatService: ChatService, private userService: UserService){
    this.userService.fetchMe().subscribe((res:any) => {
      this.userEmail = res?.email;
      this.userId= res.id;
      this.chatService.connect(this.userEmail);
      this.chatService.getChatHistory('mj@gmail.com', this.userEmail).subscribe(data=>{
        this.msgArr=data;
      })
      console.log("fetchme api", this.userEmail);
    })
    this.sub = this.chatService.getMsgObs().subscribe((message:any) => {
      if (message) {
        this.msgArr.push(message);
      }
    });
  }
 openForm() {
  document.getElementById("myForm").style.display = "block";
}

 closeForm() {
  document.getElementById("myForm").style.display = "none";
}
  sendMessage(message: any) {
    if (this.message.trim()) {
      this.chatService.sendPrivateMessage('mj@gmail.com', this.message);

      this.msgArr.push({ from: this.userEmail, content: this.message });
      console.log("🚀 ~ CustomerPageComponent ~ sendMessage ~  this.msgArr:",  this.msgArr)
      this.message = ''; // Clear input after sending
    }
  }
ngOnDestroy(): void {
  this.sub.unsubscribe()
}

}

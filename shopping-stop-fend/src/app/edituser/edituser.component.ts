import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss']
})
export class EdituserComponent implements OnDestroy{
  userId: any;
  user: any;
  orderArr: any;
  message: any='';
  msgArr: any=[];
  sub:any;
  userEmail: any;
  constructor(private userService: UserService, private route: ActivatedRoute, private alertService: AlertService, private chatService: ChatService){
    this.route.params.subscribe((params: any) => {
      this.userId = params['userId'];
      console.log("userId", this.userId);
      this.getUser();
      this.sub = this.chatService.getMsgObs().subscribe((message:any) => {
        if (message && message?.from === this.user.email) {
          this.msgArr.push(message);
        }
      });
    });
    this.userService.fetchMe().subscribe((res: any) => {
      this.userEmail = res?.email;
      this.chatService.connect(this.userEmail);

      this.userId = res.id;
      console.log("fetchme api", this.userEmail);
    })
  }
  getUser() {
    this.userService.getCustomerInfo(this.userId).subscribe((data: any) => {
      console.log("user", data);
      this.user = data.user;
      this.chatService.getChatHistory(this.userEmail, data.user.email).subscribe((data:any) =>{
        this.msgArr = data;
      })
      this.orderArr = data.orderArr;
    })
  }

  openForm() {
    document.getElementById("myForm").style.display = "block";
  }

  closeForm() {
    document.getElementById("myForm").style.display = "none";
  }

  updateOrderStatus(orderId: any, event: any): void {
    let newStatus = event?.target?.value;
    if(newStatus == "default"){
        return;
    }
    this.userService.updateOrderStatus(orderId, newStatus).subscribe((data:any) => {
      this.alertService.success(data?.msg);
      this.userService.addActivity(data?.msg).subscribe();
      this.getUser();
    });
  }
  sendMessage(message: any) {
    if (this.message.trim()) {
      this.chatService.sendPrivateMessage(this.user.email, this.message);
      
      this.msgArr.push({ from: this.userEmail, content: this.message });
      this.message = ''; // Clear input after sending
    }
  }

  
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
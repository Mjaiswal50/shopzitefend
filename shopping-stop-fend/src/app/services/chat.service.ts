import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthUtils } from '../utility/auth-utils';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket | any;
  private msgSub = new Subject()
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http :HttpClient){

  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Socket disconnected manually');
    }
  }

  getMsgObs(){
    return this.msgSub.asObservable()
  }

  connect(emailz: string) {
  if (this.socket) {
      return
  }
    this.socket = io('http://localhost:5000', {
      auth: { token: AuthUtils.getAuthToken() } // Send token for authentication
    });

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
    });


    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  

    this.socket.emit('register', emailz); // Register the user with the token
    this.socket.on('private_message', (message:any) => {
      console.log("🚀 ~ ChatService ~ this.socket.on ~ message:", message)
      this.msgSub.next(message);
    });
  }

  sendPrivateMessage(to: string, content: string) {
    if (this.socket) {
      this.socket.emit('private_message', { to, content });
    }
  }


  // Fetch chat history between two users
  getChatHistory(user1: string, user2: string): Observable<any> {
    const params = new HttpParams()
      .set('user1', user1)
      .set('user2', user2);
    return this.http.get<any>(`${this.baseUrl}/chathistory`, { params });
  }

}

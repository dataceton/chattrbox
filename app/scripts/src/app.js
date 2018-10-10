import socket from './ws-client';
import {UserStore, MessageStore} from './storage';
import {ChatForm, ChatList, promptForUsername} from './dom';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
  username = promptForUsername();
  // var messageStore = new MessageStore(`${username}.messages`);
  userStore.set(username);
}

// console.log(messageStore);
let messages = [];

class ChatApp {
  constructor() {
    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);

    socket.init('ws://localhost:3001');
    socket.registerOpenHandler(() => {
      this.chatForm.init((text) => {
        let message = new ChatMessage({message: text});
        console.log('data from app', message);
        socket.sendMessage(message.serialize());
      });
      this.chatList.init();
    });
    socket.registerMessageHandler((data) => {
      let message = new ChatMessage(data);
      console.log('message handler', message);
      this.chatList.drawMessage(message.serialize());
      messages.push(message.serialize());
    });
    socket.registerCloseHandler(() => {
      console.log('close hander');
      // messageStore.set(JSON.stringify(messages));
    });
  }
}

class ChatMessage {
  constructor({
    message: m,
    user: u=username,
    timestamp: t=(new Date()).getTime()
  }) {
    this.message = m;
    this.user = u;
    this.timestamp = t;
  }
  serialize() {
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}
window.ChatMessage = ChatMessage;
export default ChatApp;

// lib/chat.js
import { ref, push, set } from 'firebase/database';
import database from './firebase';

export const sendMessage = (userName, email, messageText) => {
  const messagesRef = ref(database, 'messages');
  const newMessageRef = push(messagesRef);
  return set(newMessageRef, {
    userName,
    email,
    messageText,
    timestamp: new Date().toISOString(),
  });
};

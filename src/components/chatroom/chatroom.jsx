import React, { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, orderBy, limit, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Navbar from "../navbar/navbar";
import avatar from "../../components/chats/chat-images/avatar.png";
import './chatroom.css'; // Import the CSS file

function ChatApp() {
  const [user] = useAuthState(getAuth());

  return (
    <div>
        <Navbar />
    <div className="chat-app">
      <header className="chat-header">
        <h1>Welcome to Addvise Chat!</h1>
      </header>
      <section className="chat-section">
        <ChatRoom currentUser={user}/>
      </section>
    </div>
    </div>
  );
}

function ChatRoom({ currentUser }) {
  const firestore = getFirestore();
  const messagesRef = collection(firestore, "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(messagesQuery, { idField: "id" });
  const [formValue, setFormValue] = useState('');
  const dummy = useRef();

  const [person, setPerson] = useState({});

  useEffect(() => {
    const fetchPerson = async () => {
      if (!currentUser) return;
      const userDoc = doc(getFirestore(), "users", currentUser.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setPerson(userSnapshot.data());
      } else {
        console.log(`No user found with UID ${currentUser.uid}`);
      }
    };

    fetchPerson();
  }, [currentUser]);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL: person.avatar || avatar
    });
    setFormValue('');
  };

  return (
    <>
      <main className="chat-main">
        {messages && messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} currentUser={currentUser} />
        ))}
        <span ref={dummy}></span>
      </main>

      <form className="chat-form" onSubmit={sendMessage}>
        <input className="chat-input" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something nice" />
        <button className="chat-submit" type="submit" disabled={!formValue}>🕊️</button>
      </form>
    </>
  );
}

function ChatMessage({ message, currentUser }) {
  const { text, uid, photoURL } = message;

  if (!currentUser) {
    return null;
  }

  const messageClass = uid === currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img className="message-avatar" src={photoURL} alt="User Avatar" />
      <p className="message-text">{text}</p>
    </div>
  );
}

export default ChatApp;

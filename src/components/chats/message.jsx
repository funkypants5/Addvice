import React, { useState, useRef, useEffect } from "react";
import "./chats.css";
import EmojiPicker from "emoji-picker-react";
import { getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../updateProfile/firebaseConfig";
import { doc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { arrayUnion, updateDoc, getDoc} from "firebase/firestore";
import { useUserStore } from "../../lib/userStore";

const Message = () => {
  const [chat, setchat] = useState(null); 
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const endRef = useRef(null);

  const { chatId, user } = useChatStore();  
  const { currentUser } = useUserStore();
  

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async () => { 
    if (text === "") return; 

    console.log(1);
    try {
      await updateDoc(doc(db,"chats", chatId), { 
        messages: arrayUnion({ 
          senderId: currentUser.id,
          text, 
          createdAt: new Date(),
        }),
      });

      console.log(2);
      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => { 
        const userChatsRef = doc(db,"userchats", id);
        const userChatsSnapshot = await getDocs(userChatsRef);
  
        if(userChatsSnapshot.exists()) { 
          const userChatsData = userChatsSnapshot.data(); 
  
          const chatIndex = userChatsData.chats.findIndex( 
            (c) => c.chatId === chatId
          ); 
  
          console.log(3);
          userChatsData[chatIndex].lastMessage = text; 
          userChatsData[chatIndex].isSeen = id === currentUser.id? true : false ; 
          userChatsData[chatIndex].updatedAt = Date.now();
  
          await updateDoc(userChatsRef, { 
            chats: userChatsData.chats,
          });
        }
      });
      console.log(4);
      setText(""); 
    } catch(err) { 
      console.log("Error sending message: ", err);
    }
  }

  useEffect(() => {
    if (!chatId) return; 
    const unSub = onSnapshot(
      doc(db, "chats", chatId),
      (res) => {
        setchat(res.data());
      },
    );

    return () => {
      unSub();
    };
  }, [chatId]);

  return (
    <div className="message-container">
      <div className="top">
        <div className="user">
          <img src={require("./chat-images/avatar.png")} alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Lorem Ipsum Dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src={require("./chat-images/phone.png")} alt="" />
          <img src={require("./chat-images/video.png")} alt="" />
          <img src={require("./chat-images/info.png")} alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => ( 
        <div className="message own" key={message?.createAt}>
          <div className="texts">
            {message.img && <img src={message.img} alt="" /> } 
            <p>
              {message.text}
            </p>
            {/*<span>1 min ago </span>*/}
          </div>
        </div>
        ))}
        <div ref={endRef}> </div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src={require("./chat-images/img.png")} alt="" />
          <img src={require("./chat-images/camera.png")} alt="" />
          <img src={require("./chat-images/mic.png")} alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji">
          <img
            src={require("./chat-images/emoji.png")}
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Message;

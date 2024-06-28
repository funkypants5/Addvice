import React, { useState, useRef, useEffect } from "react";
import "./chats.css";
import EmojiPicker from "emoji-picker-react";

const Message = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const endRef = useRef(null)

  useEffect(() => { 
    endRef.current?.scrollIntoView({behavior:"smooth"})
  },[])

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  return (
    <div className="message-container">
      <div className="top">
        <div className="user">
          <img src={require("../chat-images/avatar.png")} alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Lorem Ipsum Dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src={require("../chat-images/phone.png")} alt="" />
          <img src={require("../chat-images/video.png")} alt="" />
          <img src={require("../chat-images/info.png")} alt="" />
        </div>
      </div>
      <div className="center">
        <div className="message own">
          <div className="texts">
          <img src="https://picsum.photos/id/237/200/300" alt="" />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt et ipsum et vehicula. Integer vulputate erat eros, at mattis tortor condimentum quis. Duis ac est eget velit laoreet faucibus. Pellentesque id aliquam ligula. Suspendisse potenti. Proin vel arcu at felis ultricies viverra vitae volutpat tellus.</p>
            <span>1 min ago </span>
          </div>
          <div className="message">
            <img src={require("../chat-images/avatar.png")} alt="" />
            <div className="texts">

              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt et ipsum et vehicula. Integer vulputate erat eros, at mattis tortor condimentum quis. Duis ac est eget velit laoreet faucibus. Pellentesque id aliquam ligula. Suspendisse potenti. Proin vel arcu at felis ultricies viverra vitae volutpat tellus.</p>
              <span>1 min ago </span>
            </div>
          </div>
          <div className="message own">
            <div className="texts">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt et ipsum et vehicula. Integer vulputate erat eros, at mattis tortor condimentum quis. Duis ac est eget velit laoreet faucibus. Pellentesque id aliquam ligula. Suspendisse potenti. Proin vel arcu at felis ultricies viverra vitae volutpat tellus.</p>
              <span>1 min ago </span>
            </div>
          </div>
          <div className="message">
            <img src={require("../chat-images/avatar.png")} alt="" />
            <div className="texts">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt et ipsum et vehicula. Integer vulputate erat eros, at mattis tortor condimentum quis. Duis ac est eget velit laoreet faucibus. Pellentesque id aliquam ligula. Suspendisse potenti. Proin vel arcu at felis ultricies viverra vitae volutpat tellus.</p>
              <span>1 min ago </span>
            </div>
          </div>
          <div className="message own">
            <div className="texts">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt et ipsum et vehicula. Integer vulputate erat eros, at mattis tortor condimentum quis. Duis ac est eget velit laoreet faucibus. Pellentesque id aliquam ligula. Suspendisse potenti. Proin vel arcu at felis ultricies viverra vitae volutpat tellus.</p>
              <span>1 min ago </span>
            </div>
          </div>
          <div className="message">
            <img src={require("../chat-images/avatar.png")} alt="" />
            <div className="texts">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt et ipsum et vehicula. Integer vulputate erat eros, at mattis tortor condimentum quis. Duis ac est eget velit laoreet faucibus. Pellentesque id aliquam ligula. Suspendisse potenti. Proin vel arcu at felis ultricies viverra vitae volutpat tellus.</p>
              <span>1 min ago </span>
            </div>
          </div>
        </div>
        <div ref={endRef}> </div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src={require("../chat-images/img.png")} alt="" />
          <img src={require("../chat-images/camera.png")} alt="" />
          <img src={require("../chat-images/mic.png")} alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji">
          <img
            src={require("../chat-images/emoji.png")}
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  );
};

export default Message;

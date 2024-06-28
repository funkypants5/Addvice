import React, { useState } from "react";
import "./chats.css";

const Messagedetail = () => {
  return (
    <div className="detail">
      <div className="user">
        <img src={require("../chat-images/avatar.png")} alt="" />
        <h2>Jane</h2>
        <p>Lorem ipsum dolor sit amet</p>
      </div>
      <div className="info">
        <div className="Option">
          <div className="title">
            <span>Chat Settings</span>
            <img src={require("../chat-images/arrowUp.png")} alt="" />
          </div>
        </div>
        <div className="Option">
          <div className="title">
            <span>Privacy % help</span>
            <img src={require("../chat-images/arrowUp.png")} alt="" />
          </div>
        </div>
        <div className="Option">
          <div className="title">
            <span>Shared photos</span>
            <img src={require("../chat-images/arrowDown.png")} alt="" />
          </div>
        </div>
        <div className="Option">
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
                <span> photo_2024_2.png </span>
                <img src={require("../chat-images/download.png")} alt="" />
              </div>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
                <span> photo_2024_2.png </span>
                <img src={require("../chat-images/download.png")} alt="" />
              </div>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
                <span> photo_2024_2.png </span>
                <img src={require("../chat-images/download.png")} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="Option">
          <div className="title">
            <span>Shared Files</span>
            <img src={require("../chat-images/arrowUp.png")} alt="" />
          </div>
        </div>
      </div>
      <button> Block User </button>
    </div>
  );
};

export default Messagedetail;

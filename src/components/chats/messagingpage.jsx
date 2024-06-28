import React, { useState } from 'react';
import Message from './message';
import Chatdetail from './chatdetail';
import Messagedetail from './messagedetail';
import './chats.css';

const MessagingPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <>
    <div className="navbar">
        <button
          className=""
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Features
        </button>
        {isDropdownOpen && (
          <div className="">
            <a href="/discovery" className="">
              Discover
            </a>
            <a href="/message" className="">
              Message
            </a>
            <a href="/currentMentorMentees" className="">
              Current Mentors/Mentees
            </a>
            <a href="/profile" className="">
              Profile
            </a>
          </div>
        )}
      </div>
    <div className="messaging-page-container">
        <Chatdetail />
        <Message />
        <Messagedetail />
    </div>
    </>
  );
};

export default MessagingPage;

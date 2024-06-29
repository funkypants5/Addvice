import React, { useState } from 'react';
import Message from './message';
import Chatdetail from './chatdetail';
import Navbar from '../navbar/navbar';
import './chats.css';

const MessagingPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <>
    <Navbar/>
    <div className='Page-Content'>
    <div className="section description-section">
          <h2 className="section-title">Message</h2>
          <p className="section-text">
           Exchange ideas & learn together through our messages with one another! 
          </p>
        </div>
    <div className="messaging-page-container">
        <Chatdetail />
        <Message />
    </div>
    </div>
    </>
  );
};

export default MessagingPage;

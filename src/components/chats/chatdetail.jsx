import React, { useState } from 'react';
import Chatlist from '../chat-lists/chatlist';
import Userinfo from '../chat-lists/userinfo';
import './chats.css';

const Chatdetail = () => { 
    return ( 
        <div className='list'>
        <Userinfo /> 
        <Chatlist />
        </div>
    )
}

export default Chatdetail;
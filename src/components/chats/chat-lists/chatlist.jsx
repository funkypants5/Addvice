import React, { useState } from 'react';
import './chatlist.css';

const Chatlist = () => { 
    const[addmode,setAddMode] = useState(false);
    return ( 
        <div className="chatList">
        <div className ="search"> 
            <div className="searchBar"> 
                <img src={require('../chat-images/search.png')} alt="Search" />
                <input type="text" placeholder="Search" />
            </div>
            <img src={addmode ? require('../chat-images/plus.png') 
                : require('../chat-images/minus.png')} 
                className='add'
                onClick={() => setAddMode((prev) => !prev)}/>
        </div>
        <div className="item"> 
            <img src={require('../chat-images/avatar.png')} alt=""/>
            <div className='texts'> 
                <span>Jane Doe</span>
                <p> Hello   </p>
            </div>
        </div>
        <div className="item"> 
            <img src={require('../chat-images/avatar.png')} alt=""/>
            <div className='texts'> 
                <span>Jane Doe</span>
                <p> Hello   </p>
            </div>
        </div>
        <div className="item"> 
            <img src={require('../chat-images/avatar.png')} alt=""/>
            <div className='texts'> 
                <span>Jane Doe</span>
                <p> Hello   </p>
            </div>
        </div>
        <div className="item"> 
            <img src={require('../chat-images/avatar.png')} alt=""/>
            <div className='texts'> 
                <span>Jane Doe</span>
                <p> Hello   </p>
            </div>
        </div>
        </div>
    )
}

export default Chatlist;
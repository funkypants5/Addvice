import React, { useState } from 'react';

const Message = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold text-green-700">Message</h1>
      
      <div className="">
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
            <a href="/home" className="">
              Profile
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

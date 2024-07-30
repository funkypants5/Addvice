import React, { useEffect, useState } from "react";
import Message from "./message";
import Chatdetail from "./chatdetail";
import Navbar from "../navbar/navbar";
import { useUserStore } from "../../lib/userStore";
import "./chats.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";

const MessagingPage = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading"> The page is loading... </div>;
  return (
    <>
      <Navbar />
      <div className="Page-Content">
        <div className="section description-section">
          <h2 className="section-title">Message</h2>
          <p className="section-text">
            Exchange ideas & learn together through our messages with one
            another!
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

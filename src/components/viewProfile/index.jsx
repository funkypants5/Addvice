import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./viewProfile.css";
import sendRequest from "../../lib/sendRequest";
import Navbar from "../navbar/navbar";
import avatar from "../../components/chats/chat-images/avatar.png";

const ViewProfile = () => {
  const { uid } = useParams(); // Use uid instead of name
  const [person, setPerson] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
      } else {
        console.error("User not authenticated");
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPerson = async () => {
      if (!uid) return;
      const userDoc = doc(database, "users", uid); // Use uid directly
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setPerson(userSnapshot.data());
      } else {
        console.log(`No user found with UID ${uid}`);
      }
    };

    fetchPerson();
  }, [uid]);

  const handleAppeal = async () => {
    if (!person || !currentUser) {
      console.error("Person or current user data is missing");
      return;
    }

    try {
      console.log("Sending request to:", person.name);
      console.log("Person UID:", uid); // Ensure uid is correctly accessed
      const requestId = await sendRequest(uid, "Request details here"); // Pass uid to sendRequest function
      console.log("Request sent successfully with ID:", requestId);
      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request. Please try again.");
    }
  };

  if (!person) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <img
          className="Profile-pic"
          src={person.avatar || avatar}
          alt={`${person.name}'s avatar`}
        />
        <h2>{person.name}</h2>
        <p>Age: {person.age}</p>
        <p>Occupation: {person.occupation}</p>
        <p>Industry: {person.industry}</p>
        <p>Role: {person.role}</p>
        <p>Gender: {person.gender}</p>
        <p>Interests: {person.interests}</p>
        <p>About Me: {person.AboutMe}</p>
        <button onClick={handleAppeal} className="appeal-button">
          Apply for Mentor/Mentee
        </button>
      </div>
    </div>
  );
};

export default ViewProfile;

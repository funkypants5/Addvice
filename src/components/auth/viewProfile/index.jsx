import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from "../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import './viewProfile.css';
import sendRequest from '../../../firebase/sendRequest';

const ViewProfile = () => {
  const { name } = useParams();
  const [person, setPerson] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      if (!name) return;
      const q = query(collection(database, 'users'), where('name', '==', name));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        const personData = {
          ...docData,
          uid: querySnapshot.docs[0].id // Access the document ID as UID
        };
        setPerson(personData);
        setUid(querySnapshot.docs[0].id); // Set UID state
      } else {
        console.log(`No user found with name ${name}`);
      }
    };

    fetchPerson();
  }, [name]);

  const handleAppeal = async () => {
    if (!person || !currentUser) {
      console.error("Person or current user data is missing");
      return;
    }
  
    try {
      console.log('Sending request to:', person.name);
      console.log('Person UID:', person.uid); // Ensure uid is correctly accessed
      const requestId = await sendRequest(person.uid, "Request details here"); // Pass uid to sendRequest function
      console.log("Request sent successfully with ID:", requestId);
      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request. Please try again.");
    }
  };

  if (!person) return <div>Loading...</div>;

  return (
    <div className="profile-container">
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
            <a href="/profile" className="">
              Profile
            </a>
          </div>
        )}
      </div>
      <img src={person.profilePicture} alt={`${person.name}'s profile`} className="profile-picture" />
      <h2>{person.name}</h2>
      <p>UID: {person.uid}</p>
      <p>Age: {person.age}</p>
      <p>Occupation: {person.occupation}</p>
      <p>Industry: {person.industry}</p>
      <p>Role: {person.role}</p>
      <p>Gender: {person.gender}</p>
      <p>Interests: {person.interests}</p>
      <p>About Me: {person.AboutMe}</p>
      <button onClick={handleAppeal} className="appeal-button">Appeal for Mentor/Mentee</button>
    </div>
  );
};

export default ViewProfile;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Mentorship.css";
import Navbar from "../navbar/navbar";

const Mentorship = () => {
  const { uid } = useParams();
  const [person, setPerson] = useState();

  useEffect(() => {
    const fetchPerson = async () => {
      if (!uid) return;
      const userDoc = doc(database, "users", uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setPerson(userSnapshot.data());
      } else {
        console.log(`No user found with UID ${uid}`);
      }
    };

    fetchPerson();
  }, [uid]);

  if (!person) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <Navbar />
      <img
        src={person.profilePicture}
        alt={`${person.name}'s profile`}
        className="profile-picture"
      />
      <h2>{person.name}</h2>
      <p>Age: {person.age}</p>
      <p>Occupation: {person.occupation}</p>
      <p>Industry: {person.industry}</p>
      <p>Role: {person.role}</p>
      <p>Gender: {person.gender}</p>
      <p>Interests: {person.interests}</p>
      <p>About Me: {person.AboutMe}</p>
    </div>
  );
};

export default Mentorship;

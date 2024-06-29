import React, { useState, useEffect } from 'react';
import { database } from "../../firebase/firebase"; // Ensure the correct path
import { collection, onSnapshot } from "firebase/firestore"; // Import necessary Firestore functions
import './Discovery.css'; // Ensure correct import path
import Navbar from '../navbar/navbar';
import { Link } from "react-router-dom";

const Discovery = () => {
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showIndustry, setShowIndustry] = useState(true);
  const [showRole, setShowRole] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(database, 'users'), snapshot => {
      const peopleData = snapshot.docs.map(doc => doc.data());
      setPeople(peopleData);
      setFilteredPeople(peopleData); // Initialize filtered list with all people
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Filter people based on selected categories
    const filtered = people.filter(person => {
      const industryMatch = showIndustry ? true : person.industry === "Your Industry"; // Adjust condition based on your data
      const roleMatch = showRole ? true : person.role === "Your Role"; // Adjust condition based on your data
      return industryMatch && roleMatch;
    });
    setFilteredPeople(filtered);
  }, [people, showIndustry, showRole]);

  return (
    <div> 
      <Navbar />
      <div className="container">
        <div className='Feature-Description'> 
      <h1 className="title">Discovery</h1>
        <p className='text-description'>Discover and connect with mentors and mentees based on industry and role preferences.</p>
        </div> 
        <div className="toggle-buttons">
  <button
    className={`Nav-button ${showIndustry ? "disabled-button" : "primary-button-hover"}`}
    onClick={() => setShowIndustry(!showIndustry)} // Disable button based on condition
  >
    Industry
  </button>
  <button
    className={`Nav-button ${showRole ? "disabled-button" : "primary-button-hover"}`}
    onClick={() => setShowRole(!showRole)}
  >
    Role
  </button>
</div>

        
        <div className="profiles-container">
          {filteredPeople.map(person => (
            <Link to={`/viewProfile/${person.name}`} key={person.name} className="profile-box">
              <img 
                src={person.profilePicture} 
                alt={`${person.name}'s profile`} 
                className="profile-picture"
              />
              <h3>{person.name}</h3>
              <p>Age: {person.age}</p>
              <p>Industry: {person.industry}</p>
              <p>Gender: {person.gender}</p>
              <p>Role: {person.role}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discovery;

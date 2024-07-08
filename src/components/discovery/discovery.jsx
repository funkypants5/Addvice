import React, { useState, useEffect } from "react";
import { database } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "./Discovery.css";
import Navbar from "../navbar/navbar";
import { Link } from "react-router-dom";
import { Form, InputGroup, Dropdown, DropdownButton } from "react-bootstrap";

const Discovery = () => {
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [showIndustry, setShowIndustry] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, "users"),
      (snapshot) => {
        const peopleData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPeople(peopleData);
        setFilteredPeople(peopleData);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = people.filter((person) => {
      const industryMatch = showIndustry
        ? true
        : person.industry === "Your Industry";
      const roleMatch = selectedRole ? person.role === selectedRole : true;
      return industryMatch && roleMatch;
    });
    setFilteredPeople(filtered);
  }, [people, showIndustry, selectedRole]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="Feature-Description">
          <h1 className="title">Discovery</h1>
          <p className="text-description">
            Discover and connect with mentors and mentees based on industry and
            role preferences.
          </p>
        </div>
        <div className="toggle-buttons">
          <button
            className={`Nav-button ${
              showIndustry ? "disabled-button" : "primary-button-hover"
            }`}
            onClick={() => setShowIndustry(!showIndustry)}
          >
            Industry
          </button>
          <DropdownButton
            className="Nav-button primary-button-hover"
            title={selectedRole || "Role"}
            onSelect={handleRoleSelect}
          >
            <Dropdown.Item eventKey="Mentor">Mentor</Dropdown.Item>
            <Dropdown.Item eventKey="Mentee">Mentee</Dropdown.Item>
          </DropdownButton>

          <Form>
            <InputGroup>
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                className="Search-Bar"
                placeholder="Search User"
              />
            </InputGroup>
          </Form>
        </div>

        <div className="profiles-container">
          {filteredPeople
            .filter((person) => {
              const nameMatch =
                search.toLowerCase() === ""
                  ? true
                  : person.name.toLowerCase().includes(search.toLowerCase());
              const roleMatch =
                selectedRole === ""
                  ? true
                  : person.role.toLowerCase() === selectedRole.toLowerCase();
              return nameMatch && roleMatch;
            })

            .map((person) => (
              <Link
                to={`/viewProfile/${person.name}`}
                key={person.id}
                className="profile-box"
              >
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

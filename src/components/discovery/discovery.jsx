import React, { useState, useEffect } from "react";
import { database } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "./Discovery.css";
import Navbar from "../navbar/navbar";
import { Link } from "react-router-dom";
import { DropdownButton, Form, InputGroup } from "react-bootstrap";
import FilterRole from "./FilterRole";
import FilterIndustry from "./FilterIndustry";

const Discovery = () => {
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [search, setSearch] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [selectedRoleFilters, setSelectedRoleFilters] = useState([]);
  const [selectedIndustryFilters, setSelectedIndustryFilters] = useState([]);

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
    // Apply filters whenever selected filters change
    applyFilters();
  }, [selectedRoleFilters, selectedIndustryFilters]);

  const applyFilters = () => {
    let filtered = people.filter((person) => {
      const roleMatch =
        selectedRoleFilters.length === 0 ||
        selectedRoleFilters.includes(person.role.toLowerCase());

      const industryMatch =
        selectedIndustryFilters.length === 0 ||
        selectedIndustryFilters.includes(person.industry.toLowerCase());

      return roleMatch && industryMatch;
    });

    // Apply search filter
    filtered = applySearchFilter(filtered);

    setFilteredPeople(filtered);
  };

  const applySearchFilter = (filteredPeople) => {
    return filteredPeople.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleRoleFilter = (selectedFilters) => {
    setSelectedRoleFilters(
      selectedFilters.map((filter) => filter.toLowerCase())
    );
  };

  const handleIndustryFilter = (selectedFilters) => {
    setSelectedIndustryFilters(
      selectedFilters.map((filter) => filter.toLowerCase())
    );
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
            className="Nav-button"
            onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
          >
            Industry
          </button>
          {isIndustryDropdownOpen && (
            <div className="dropdown-container">
              <FilterIndustry items={people} onFilter={handleIndustryFilter} />
            </div>
          )}
          <button
            className="Nav-button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
          >
            Role
          </button>
          {isRoleDropdownOpen && (
            <div className="dropdown-container">
              <FilterRole items={people} onFilter={handleRoleFilter} />
            </div>
          )}

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
              return nameMatch;
            })
            .map((person) => (
              <Link
                to={`/viewProfile/${person.id}`} // Pass uid instead of name
                key={person.id}
                className="profile-box"
              >
                <img
                  src={person.profilePicture}
                  alt={`${person.name}'s profile`} // Ensure backticks are used here too
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

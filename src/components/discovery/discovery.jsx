import React, { useState, useEffect, useRef } from "react";
import { database } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "./Discovery.css";
import Navbar from "../navbar/navbar";
import { Link } from "react-router-dom";
import { Form, InputGroup } from "react-bootstrap";
import FilterRole from "./FilterRole";
import FilterIndustry from "./FilterIndustry";
import avatar from "../../components/chats/chat-images/avatar.png";
import "./searchbar.css";
import { getAuth } from "firebase/auth";

const ITEMS_PER_PAGE = 4;

const Discovery = () => {
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [displayedPeople, setDisplayedPeople] = useState([]);
  const [search, setSearch] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [selectedRoleFilters, setSelectedRoleFilters] = useState([]);
  const [selectedIndustryFilters, setSelectedIndustryFilters] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    // Get the current user's ID
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    }

    const unsubscribe = onSnapshot(
      collection(database, "users"),
      (snapshot) => {
        const peopleData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPeople(peopleData);
        setFilteredPeople(
          peopleData.filter((person) => person.id !== user.uid),
        ); // Exclude current user immediately
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Apply filters whenever selected filters change
    applyFilters();
  }, [selectedRoleFilters, selectedIndustryFilters, currentUserId, search]);

  useEffect(() => {
    setPage(1);
    const initialDisplayedPeople = filteredPeople.slice(0, ITEMS_PER_PAGE);
    setDisplayedPeople(initialDisplayedPeople);
    setHasMore(initialDisplayedPeople.length < filteredPeople.length);
  }, [filteredPeople]);

  useEffect(() => {
    if (page === 1) return;
    const newDisplayedPeople = filteredPeople.slice(0, page * ITEMS_PER_PAGE);
    setDisplayedPeople(newDisplayedPeople);
    setHasMore(newDisplayedPeople.length < filteredPeople.length);
    console.log(
      `Loaded page ${page}, total displayed: ${newDisplayedPeople.length}`,
    );
  }, [page]);

  const applyFilters = () => {
    let filtered = people.filter((person) => {
      const roleMatch =
        selectedRoleFilters.length === 0 ||
        selectedRoleFilters.includes(person.role.toLowerCase());

      const industryMatch =
        selectedIndustryFilters.length === 0 ||
        selectedIndustryFilters.includes(person.industry.toLowerCase());

      // Exclude the current user's profile
      const excludeCurrentUser = person.id !== currentUserId;

      return roleMatch && industryMatch && excludeCurrentUser;
    });

    // Apply search filter
    filtered = applySearchFilter(filtered);

    setFilteredPeople(filtered);
  };

  const applySearchFilter = (filteredPeople) => {
    return filteredPeople.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const handleRoleFilter = (selectedFilters) => {
    setSelectedRoleFilters(
      selectedFilters.map((filter) => filter.toLowerCase()),
    );
  };

  const handleIndustryFilter = (selectedFilters) => {
    setSelectedIndustryFilters(
      selectedFilters.map((filter) => filter.toLowerCase()),
    );
  };

  const handleResetFilters = () => {
    setSelectedRoleFilters([]);
    setSelectedIndustryFilters([]);
    setSearch("");
  };

  const lastProfileElementRef = useRef();
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        console.log("Last element intersecting, loading more...");
        setPage((prevPage) => prevPage + 1);
      }
    };

    if (lastProfileElementRef.current) {
      observer.current = new IntersectionObserver(callback, options);
      observer.current.observe(lastProfileElementRef.current);
    }

    return () => {
      if (observer.current && lastProfileElementRef.current) {
        observer.current.unobserve(lastProfileElementRef.current);
      }
    };
  }, [displayedPeople, hasMore]);

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

          <button className="Nav-button" onClick={handleResetFilters}>
            Reset
          </button>
        </div>

        <div className="profiles-container">
          {displayedPeople.map((person, index) => {
            if (index === displayedPeople.length - 1) {
              return (
                <Link
                  ref={lastProfileElementRef}
                  to={`/viewProfile/${person.id}`} // Pass uid instead of name
                  key={person.id}
                  className="profile-box"
                >
                  <img
                    src={person.avatar || avatar}
                    alt={`${person.name}'s profile`} // Ensure backticks are used here too
                    className="profile-picture"
                  />
                  <h3>{person.name}</h3>
                  <p>Age: {person.age}</p>
                  <p>Industry: {person.industry}</p>
                  <p>Gender: {person.gender}</p>
                  <p>Role: {person.role}</p>
                </Link>
              );
            } else {
              return (
                <Link
                  to={`/viewProfile/${person.id}`} // Pass uid instead of name
                  key={person.id}
                  className="profile-box"
                >
                  <img
                    src={person.avatar || avatar}
                    alt={`${person.name}'s profile`} // Ensure backticks are used here too
                    className="profile-picture"
                  />
                  <h3>{person.name}</h3>
                  <p>Age: {person.age}</p>
                  <p>Industry: {person.industry}</p>
                  <p>Gender: {person.gender}</p>
                  <p>Role: {person.role}</p>
                </Link>
              );
            }
          })}
        </div>
        {!hasMore && <p className="end-message">Yay! You have seen it all.</p>}
      </div>
    </div>
  );
};

export default Discovery;

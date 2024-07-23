import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { database } from "../../lib/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./currentMentorMentee.css";
import Navbar from "../navbar/navbar";

const CurrentMentorMentee = () => {
  const [requests, setRequests] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const q = query(
          collection(doc(database, "users", currentUser.uid), "requests")
        );
        const querySnapshot = await getDocs(q);
        const requestsData = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const requestData = docSnapshot.data();
            const fromUserDoc = await getDoc(
              doc(database, "users", requestData.from)
            );
            const fromUserData = fromUserDoc.exists()
              ? fromUserDoc.data()
              : { name: "Unknown" };
            return {
              id: docSnapshot.id,
              ...requestData,
              fromName: fromUserData.name,
            };
          })
        );
        setRequests(requestsData);
      } else {
        console.error("User not authenticated");
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchMentorsAndMentees = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const mentorsQuery = query(
          collection(doc(database, "users", currentUser.uid), "mentors")
        );
        const menteesQuery = query(
          collection(doc(database, "users", currentUser.uid), "mentees")
        );

        const [mentorsSnapshot, menteesSnapshot] = await Promise.all([
          getDocs(mentorsQuery),
          getDocs(menteesQuery),
        ]);

        const fetchProfile = async (uid) => {
          const userDoc = doc(database, "users", uid);
          const userSnapshot = await getDoc(userDoc);
          return userSnapshot.exists() ? userSnapshot.data() : null;
        };

        const mentorsData = await Promise.all(
          mentorsSnapshot.docs.map(async (docSnapshot) => ({
            id: docSnapshot.id,
            ...(await fetchProfile(docSnapshot.id)),
          }))
        );

        const menteesData = await Promise.all(
          menteesSnapshot.docs.map(async (docSnapshot) => ({
            id: docSnapshot.id,
            ...(await fetchProfile(docSnapshot.id)),
          }))
        );

        setMentors(mentorsData);
        setMentees(menteesData);
      } else {
        console.error("User not authenticated");
      }
    };

    fetchMentorsAndMentees();
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const requestRef = doc(
          database,
          "users",
          currentUser.uid,
          "requests",
          requestId
        );
        const requestSnapshot = await getDoc(requestRef);

        if (requestSnapshot.exists()) {
          const requestData = requestSnapshot.data();

          // Fetch current user's profile to determine their role
          const currentUserProfileRef = doc(database, "users", currentUser.uid);
          const currentUserProfileSnapshot = await getDoc(
            currentUserProfileRef
          );
          const currentUserProfile = currentUserProfileSnapshot.exists()
            ? currentUserProfileSnapshot.data()
            : null;

          if (!currentUserProfile) {
            console.error("Current user profile not found");
            return;
          }

          // Determine the role of the current user and the sender, and add to the appropriate subcollection
          if (currentUserProfile.role === "mentor") {
            const menteesCollection = collection(
              doc(database, "users", currentUser.uid),
              "mentees"
            );
            await setDoc(doc(menteesCollection, requestData.from), requestData);
            const mentorsCollection = collection(
              doc(database, "users", requestData.from),
              "mentors"
            );
            await setDoc(doc(mentorsCollection, currentUser.uid), {
              uid: currentUser.uid,
              timestamp: new Date(),
            });
          } else if (currentUserProfile.role === "mentee") {
            const mentorsCollection = collection(
              doc(database, "users", currentUser.uid),
              "mentors"
            );
            await setDoc(doc(mentorsCollection, requestData.from), requestData);
            const menteesCollection = collection(
              doc(database, "users", requestData.from),
              "mentees"
            );
            await setDoc(doc(menteesCollection, currentUser.uid), {
              uid: currentUser.uid,
              timestamp: new Date(),
            });
          }

          // Remove the request from the requests collection
          await deleteDoc(requestRef);

          console.log("Request accepted successfully");
          setRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== requestId)
          );
        } else {
          console.error("Request not found");
        }
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const requestRef = doc(
          database,
          "users",
          currentUser.uid,
          "requests",
          requestId
        );
        await deleteDoc(requestRef);
        console.log("Request rejected successfully");
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const deleteMentor = async (mentorId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const mentorRef = doc(
          database,
          "users",
          currentUser.uid,
          "mentors",
          mentorId
        );
        await deleteDoc(mentorRef);
        console.log("Mentor deleted successfully");
        setMentors((prevMentors) =>
          prevMentors.filter((mentor) => mentor.id !== mentorId)
        );
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error deleting mentor:", error);
    }
  };

  const deleteMentee = async (menteeId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const menteeRef = doc(
          database,
          "users",
          currentUser.uid,
          "mentees",
          menteeId
        );
        await deleteDoc(menteeRef);
        console.log("Mentee deleted successfully");
        setMentees((prevMentees) =>
          prevMentees.filter((mentee) => mentee.id !== menteeId)
        );
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error deleting mentee:", error);
    }
  };

  const handleProfileClick = (uid) => {
    navigate(`/Mentorship/${uid}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="Feature-Description">
          <h1 className="title">Current Mentor/Mentee</h1>
          <p className="Sub-Title">
            Manage your current mentorship and menteeship relationships. Accept
            or reject requests, and connect with mentors and mentees.
          </p>
        </div>
        <div className="section">
          <h2>Requests</h2>
          <ul>
            {requests.map((request) => (
              <li key={request.id}>
                <p>From: {request.fromName}</p>
                <p>Status: {request.status}</p>
                <button
                  className="Nav-button"
                  onClick={() => acceptRequest(request.id)}
                >
                  Accept Request
                </button>
                <button
                  className="Nav-button reject-button"
                  onClick={() => rejectRequest(request.id)}
                >
                  Reject Request
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h2>Mentors</h2>
          <ul className="users">
            {mentors.map((mentor) => (
              <li key={mentor.id} className="profile-box">
                <button
                  className="delete-button"
                  onClick={() => deleteMentor(mentor.id)}
                >
                  X
                </button>
                <div onClick={() => handleProfileClick(mentor.id)}>
                  <h3>{mentor.name}</h3>
                  <p>Age: {mentor.age}</p>
                  <p>Occupation: {mentor.occupation}</p>
                  <p>Industry: {mentor.industry}</p>
                  <p>Gender: {mentor.gender}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h2>Mentees</h2>
          <ul className="users">
            {mentees.map((mentee) => (
              <li key={mentee.id} className="profile-box">
                <button
                  className="delete-button"
                  onClick={() => deleteMentee(mentee.id)}
                >
                  X
                </button>
                <div onClick={() => handleProfileClick(mentee.id)}>
                  <h3>{mentee.name}</h3>
                  <p>Age: {mentee.age}</p>
                  <p>Occupation: {mentee.occupation}</p>
                  <p>Industry: {mentee.industry}</p>
                  <p>Gender: {mentee.gender}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CurrentMentorMentee;

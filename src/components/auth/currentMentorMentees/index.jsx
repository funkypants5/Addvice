import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { database } from '../../../lib/firebase';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './currentMentorMentee.css';
import Navbar from '../../navbar/navbar';

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
        const q = query(collection(doc(database, 'users', currentUser.uid), 'requests'));
        const querySnapshot = await getDocs(q);
        const requestsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRequests(requestsData);
      } else {
        console.error('User not authenticated');
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchMentorsAndMentees = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const mentorsQuery = query(collection(doc(database, 'users', currentUser.uid), 'mentors'));
        const menteesQuery = query(collection(doc(database, 'users', currentUser.uid), 'mentees'));

        const [mentorsSnapshot, menteesSnapshot] = await Promise.all([
          getDocs(mentorsQuery),
          getDocs(menteesQuery)
        ]);

        const fetchProfile = async (uid) => {
          const userDoc = doc(database, 'users', uid);
          const userSnapshot = await getDoc(userDoc);
          return userSnapshot.exists() ? userSnapshot.data() : null;
        };

        const mentorsData = await Promise.all(mentorsSnapshot.docs.map(async doc => ({
          id: doc.id,
          ...await fetchProfile(doc.id)
        })));

        const menteesData = await Promise.all(menteesSnapshot.docs.map(async doc => ({
          id: doc.id,
          ...await fetchProfile(doc.id)
        })));

        setMentors(mentorsData);
        setMentees(menteesData);
      } else {
        console.error('User not authenticated');
      }
    };

    fetchMentorsAndMentees();
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const requestRef = doc(database, 'users', currentUser.uid, 'requests', requestId);
        const requestSnapshot = await getDoc(requestRef);

        if (requestSnapshot.exists()) {
          const requestData = requestSnapshot.data();

          // Add to mentors or mentees subcollection
          const mentorsCollection = collection(doc(database, 'users', currentUser.uid), 'mentors');
          await setDoc(doc(mentorsCollection, requestData.from), requestData);

          const menteesCollection = collection(doc(database, 'users', requestData.from), 'mentees');
          await setDoc(doc(menteesCollection, currentUser.uid), {
            uid: currentUser.uid,
            timestamp: new Date(),
          });

          // Remove the request from the requests collection
          await deleteDoc(requestRef);

          console.log('Request accepted successfully');
          setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
        } else {
          console.error('Request not found');
        }
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const requestRef = doc(database, 'users', currentUser.uid, 'requests', requestId);
        await deleteDoc(requestRef);
        console.log('Request rejected successfully');
        setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleProfileClick = (name) => {
    navigate(`/viewProfile/${name}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="Feature-Description">
          <h1 className="title">Current Mentor/Mentee</h1>
          <p>Manage your current mentorship and menteeship relationships. Accept or reject requests, and connect with mentors and mentees.</p>
        </div>
      <div className='section'> 
        <h2>Requests</h2>
        <ul>
          {requests.map(request => (
            <li key={request.id}>
              <p>From: {request.from}</p>
              <p>Status: {request.status}</p>
              <button className="Nav-button" onClick={() => acceptRequest(request.id)}>Accept Request</button>
              <button className="Nav-button reject-button" onClick={() => rejectRequest(request.id)}>Reject Request</button>
            </li>
          ))}
        </ul>
        </div>
        <div className='section'> 
        <h2>Mentors</h2>
        <ul>
          {mentors.map(mentor => (
            <li key={mentor.id} className="profile-box" onClick={() => handleProfileClick(mentor.name)}>
              <h3>{mentor.name}</h3>
              <p>Age: {mentor.age}</p>
              <p>Occupation: {mentor.occupation}</p>
              <p>Industry: {mentor.industry}</p>
              <p>Gender: {mentor.gender}</p>
            </li>
          ))}
        </ul>
        </div>
        <div className='section'> 
        <h2>Mentees</h2>
        <ul>
          {mentees.map(mentee => (
            <li key={mentee.id} className="profile-box" onClick={() => handleProfileClick(mentee.name)}>
              <h3>{mentee.name}</h3>
              <p>Age: {mentee.age}</p>
              <p>Occupation: {mentee.occupation}</p>
              <p>Industry: {mentee.industry}</p>
              <p>Role: {mentee.role}</p>
              <p>Gender: {mentee.gender}</p>
              <p>Interests: {mentee.interests}</p>
              <p>About Me: {mentee.AboutMe}</p>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
};

export default CurrentMentorMentee;

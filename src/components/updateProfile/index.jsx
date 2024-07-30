import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import "./firebaseConfig";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import upload from "../../lib/uploadPic";
import Navbar from "../navbar/navbar";

import "./updateProfile.css";

const Profile = () => {
  const { currentUser } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [avatar, setAvatar] = useState({
    file: "",
    url: "",
  });

  const [formData, setFormData] = useState({
    name: currentUser.displayName || "Your Name",
    age: "",
    occupation: "",
    industry: "",
    role: "",
    gender: "",
    AboutMe: "",
    tele: "",
    avatar: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const db = getFirestore();
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      setFormData(userData);
      if (userData.avatar) {
        setAvatar({
          file: "",
          url: userData.avatar,
        });
      }
    }
  };

  const handleChange = (event) => {
    const { name, files } = event.target;
    if (name === "avatar" && files.length > 0) {
      setAvatar({
        file: files[0],
        url: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: event.target.value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveDataToFirestore();
    setIsSubmitted(true);
  };

  const saveDataToFirestore = async () => {
    const db = getFirestore();
    const storage = getStorage();

    let imgUrl = formData.avatar; // Default to existing avatar URL

    if (avatar.file) {
      imgUrl = await upload(avatar.file); // Upload new avatar and get URL
    }

    await setDoc(doc(db, "users", currentUser.uid), {
      ...formData,
      avatar: imgUrl, // Update avatar URL in Firestore
      id: currentUser.uid,
    });
    alert("Profile Updated!");

    await setDoc(doc(db, "userchats", currentUser.uid), {
      chats: [],
    });

    setFormData((prevData) => ({
      ...prevData,
      avatar: imgUrl, // Update formData with new avatar URL
    }));
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="content-container">
          <div className="feature-description">
            <h1 className="section-title">Update Your Profile</h1>
            <p className="section-text">
              Keep your profile up to date to get the best experience.
            </p>
          </div>

          <div className="onboarding">
            <form onSubmit={handleSubmit}>
              <section className="photo-section">
                <div className="photo-container">
                  <label>
                    {avatar.url ? (
                      <img src={avatar.url} alt="avatar" />
                    ) : (
                      <div>Upload your profile picture here!</div>
                    )}
                  </label>
                </div>
                <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleChange}
                    />
              </section>
              <section className="details-section">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
                <label className="multiple-input-container">Age</label>
                <select
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                >
                  <option value="">Age</option>
                  <option value="18-25">18-25</option>
                  <option value="25-30">25-30</option>
                  <option value="30-40">30-40</option>
                  <option value="40-50">40-50</option>
                  <option value="50-60">50-60</option>
                  <option value="60+">60+</option>
                </select>

                <label className="multiple-input-container">Occupation</label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className=""
                  required
                >
                  <option value="">Select Occupation</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <label className="multiple-input-container">Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                <label className="">Role</label>
                <select
                  name="role"
                  placeholder="Selct Role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="mentor">Mentor</option>
                  <option value="mentee">Mentee</option>
                </select>

                <label className="multiple-input-container">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Selct Gender"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="Other">Prefer not to say</option>
                </select>

                <label htmlFor="AboutMe">About Me</label>
                <textarea
                  id="AboutMe"
                  name="AboutMe"
                  value={formData.AboutMe}
                  onChange={handleChange}
                  className=""
                  required
                  placeholder="Tell us about yourself..."
                />
                <label htmlFor="Telegram">Telegram Handle</label>
                <textarea
                  id="tele"
                  name="tele"
                  value={formData.tele}
                  onChange={handleChange}
                  className=""
                  placeholder="Your tele handle will only be shown to your mentors/mentees"
                />
                <button type="submit" className="update-button">
                  Update Profile
                </button>
              </section>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Construction",
  "Manufacturing",
  "Retail",
  "Transportation",
  "Real Estate",
  "Telecommunications",
  "Energy",
  "Entertainment",
  "Hospitality",
  "Agriculture",
  "Aerospace",
];

const roles = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Marketing Specialist",
  "Sales Representative",
  "HR Manager",
  "Accountant",
  "Consultant",
  "Graphic Designer",
  "Customer Service",
  "Business Analyst",
  "Project Manager",
  "Researcher",
  "Operations Manager",
  "Student",
];

export default Profile;

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import "./firebaseConfig"; // Ensure Firebase is initialized
import {getFirestore, getDoc, doc, setDoc} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from '../navbar/navbar';
import "./updateProfile.css"

const Profile = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser.displayName || "Your Name",
    age: "",
    occupation: "",
    industry: "",
    role: "mentee", // default value
    gender: "male", // default value
    interests: "",
    AboutMe: "", // corrected field name
    profilePicture: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUserData(); // Fetch user data when component mounts
  }, []);

  const fetchUserData = async () => {
    const db = getFirestore();
    const userDocRef = doc(db, "users", currentUser.uid); 
    const userDocSnapshot = await getDoc(userDocRef); 
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data(); 
      setFormData(userData); 
    }
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "profilePicture" && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: files[0], // Store the file object
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveDataToFirestore();
    setIsSubmitted(true);
  };

  const saveDataToFirestore = async () => {
    const db = getFirestore(); // Get Firestore instance
    const storage = getStorage(); // Get Firebase Storage instance

    // Upload profile picture if it exists
    let profilePictureURL = "";
    if (formData.profilePicture instanceof File) {
      profilePictureURL = await uploadProfilePicture(storage, formData.profilePicture);
    }

    const userDocRef = doc(db, "users", currentUser.uid); // Reference to user document
    await setDoc(userDocRef, {
      ...formData,
      profilePicture: profilePictureURL,
    }); 
    alert("Profile Updated!");
  };

  const uploadProfilePicture = async (storage, profilePicture) => {
    try {
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}/${profilePicture.name}`);
      await uploadBytes(storageRef, profilePicture);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div className="content-container">
        <div className="feature-description">
          <h1 className="section-title">Update Your Profile</h1>
          <p className="section-text">Keep your profile up to date to get the best experience.</p>
        </div>

        <div className="onboarding">
          <form onSubmit={handleSubmit}>
            <section className="photo-section">
              <div className="photo-container">
                <label>
                  {formData.profilePicture && !(formData.profilePicture instanceof File) ? (
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                    />
                  ) : formData.profilePicture ? (
                    <img
                      src={URL.createObjectURL(formData.profilePicture)}
                      alt="Profile"
                    />
                  ) : (
                    <div>Upload your profile picture here!</div>
                  )}
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </label>
              </div>
            </section>
            <section className="details-section">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Handsome Zack"
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
                <option value="">Select Role</option>
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
                value={formData.role}
                onChange={handleChange}
                disabled={isSubmitted}
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
                disabled={isSubmitted}
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
                placeholder="Share more about yourself here!"
              />
              <button type="submit" className="update-button">
                Update Profile
              </button>
            </section>
          </form>
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

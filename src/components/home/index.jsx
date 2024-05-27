import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import './firebaseConfig'; // Add this line to prevent firebase not loading error
import { getFirestore, addDoc, collection, getDoc, doc, setDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const Home = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser.displayName || '',
    age: '',
    occupation: '',
    industry: '',
    role: 'mentee', // default value
    gender: 'male', // default value
    interests: '',
    profilePicture: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUserData(); // Fetch user data when component mounts
  }, []); // Empty dependency array ensures this effect runs only once

  const fetchUserData = async () => {
    const db = getFirestore(); // Get Firestore instance
    const userDocRef = doc(db, 'users', currentUser.uid); // Reference to user document
    const userDocSnapshot = await getDoc(userDocRef); // Get user document snapshot
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data(); // Extract user data from snapshot
      setFormData(userData); // Set form data with user data
    }
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'profilePicture') {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: files[0],
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
    let profilePictureURL = formData.profilePicture ? await uploadProfilePicture(storage, formData.profilePicture) : null;
  
    // Save form data to Firestore
    const userDocRef = doc(db, 'users', currentUser.uid); // Reference to user document
    await setDoc(userDocRef, { ...formData, profilePicture: profilePictureURL }); // Set user document with form data
    alert("Document written to Database");
  };
  
  const uploadProfilePicture = async (storage, profilePicture) => {
    try {
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}/${profilePicture.name}`);
      await uploadBytes(storageRef, profilePicture);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  };
  
  

  return (
    <div className='pt-14'>
      <div className='max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 relative'>
        <div className='absolute top-0 right-0 mt-4 mr-4'>
          <div className='relative'>
            <button
              className='bg-green-600 text-white py-2 px-4 rounded-md'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Features
            </button>
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg'>
                <a href='#' className='block px-4 py-2 text-gray-800 hover:bg-green-100'>Discover</a>
                <a href='#' className='block px-4 py-2 text-gray-800 hover:bg-green-100'>Matching</a>
                <a href='#' className='block px-4 py-2 text-gray-800 hover:bg-green-100'>Current Mentors/Mentees</a>
              </div>
            )}
          </div>
        </div>
        <div className='text-center mb-6'>
          <h1 className='text-4xl font-bold text-orange-600'>Welcome to Addvise</h1>
          <h2 className='text-3xl font-bold text-green-700 mt-2'>Update Your Profile</h2>
          <p className='text-gray-600'>Keep your profile up to date to get the best experience.</p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex justify-center'>
            <label className='cursor-pointer'>
              <div className='relative'>
                {formData.profilePicture ? (
                  <img
                    src={URL.createObjectURL(formData.profilePicture)}
                    alt='Profile'
                    className='w-32 h-32 rounded-full object-cover border-4 border-green-700'
                  />
                ) : (
                  <div className='w-32 h-32 flex items-center justify-center bg-green-100 rounded-full border-4 border-green-700 text-green-700'>
                    Upload
                  </div>
                )}
                <input
                  type='file'
                  name='profilePicture'
                  accept='image/*'
                  onChange={handleChange}
                  className='absolute inset-0 opacity-0 cursor-pointer'
                />
              </div>
            </label>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Age</label>
              <input
                type='number'
                name='age'
                value={formData.age}
                onChange={handleChange}
                className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Occupation</label>
              <input
                type='text'
                name='occupation'
                value={formData.occupation}
                onChange={handleChange}
                className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Industry</label>
              <input
                type='text'
                name='industry'
                value={formData.industry}
                onChange={handleChange}
                className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Role</label>
              <select
                name='role'
                value={formData.role}
                onChange={handleChange}
                className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                disabled={isSubmitted}
                required
              >
                <option value='mentor'>Mentor</option>
                <option value='mentee'>Mentee</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Gender</label>
              <select
                name                ='gender'
                value={formData.gender}
                onChange={handleChange}
                className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                disabled={isSubmitted}
                required
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Interests</label>
            <textarea
              name='interests'
              value={formData.interests}
              onChange={handleChange}
              className='mt-1 p-2 border border-gray-300 rounded-md w-full h-32'
              required
            />
          </div>
          <div className='text-center'>
            <button
              type='submit'
              className='mt-4 p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md w-full md:w-1/2'
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;


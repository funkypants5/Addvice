import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { database } from "./firebase"; // Ensure correct path to your Firebase configuration

const sendRequest = async (recipientUid, requesterDetails) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    console.log("Current User:", currentUser);

    if (currentUser) {
      // Fetch the current user's role
      const userDocRef = doc(database, "users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        console.error("User document not found");
        throw new Error("User document not found");
      }

      const userData = userDocSnapshot.data();
      const userRole = userData.role; // Assuming the role is stored as 'role' in user document

      const requestsCollection = collection(
        doc(database, "users", recipientUid),
        "requests"
      );

      const requestDoc = {
        from: currentUser.uid,
        to: recipientUid,
        details: requesterDetails,
        role: userRole, // Include the sender's role
        status: "pending",
        timestamp: new Date(),
      };

      const docRef = await addDoc(requestsCollection, requestDoc);
      console.log("Request sent successfully with ID: ", docRef.id);
      return docRef.id;
    } else {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }
  } catch (error) {
    console.error("Error sending request:", error);
    throw error;
  }
};

export default sendRequest;

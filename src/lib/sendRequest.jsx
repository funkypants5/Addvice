import { collection, addDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { database } from "./firebase"; // Ensure correct path to your Firebase configuration

const sendRequest = async (recipientUid, requesterDetails) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    console.log("Current User:", currentUser);

    if (currentUser) {
      const userDocRef = doc(database, "users", recipientUid);
      const requestsCollection = collection(userDocRef, "requests");

      const requestDoc = {
        from: currentUser.uid,
        to: recipientUid,
        details: requesterDetails,
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

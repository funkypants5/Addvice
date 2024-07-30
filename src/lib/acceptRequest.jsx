import { doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { database } from "../firebase/firebase"; // Ensure correct path to your Firebase configuration

const acceptRequest = async (requestId, recipientUid) => {
  try {
    const requestDocRef = doc(
      database,
      "users",
      recipientUid,
      "requests",
      requestId,
    );

    const requestSnapshot = await getDoc(requestDocRef);
    if (requestSnapshot.exists()) {
      const requestData = requestSnapshot.data();

      // Add to mentors or mentees subcollection
      const mentorsCollection = collection(
        doc(database, "users", recipientUid),
        "mentors",
      );
      await setDoc(doc(mentorsCollection, requestData.from), requestData);

      // Optionally, add the recipient to the requester's mentees subcollection
      const menteesCollection = collection(
        doc(database, "users", requestData.from),
        "mentees",
      );
      await setDoc(doc(menteesCollection, recipientUid), {
        uid: recipientUid,
        timestamp: new Date(),
      });

      // Remove the request from the requests collection
      await deleteDoc(requestDocRef);

      console.log("Request accepted successfully");
    } else {
      console.error("Request not found");
    }
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error; // Throw the error to handle it in calling code
  }
};

export default acceptRequest;

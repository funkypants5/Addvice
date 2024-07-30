import { doc, collection, setDoc, getDoc, deleteDoc } from "firebase/firestore";
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

      // Check the sender's role and add to the appropriate subcollection
      if (requestData.role === "mentor") {
        const mentorsCollection = collection(
          doc(database, "users", recipientUid),
          "mentors",
        );
        await setDoc(doc(mentorsCollection, requestData.from), requestData);
      } else if (requestData.role === "mentee") {
        const menteesCollection = collection(
          doc(database, "users", recipientUid),
          "mentees",
        );
        await setDoc(doc(menteesCollection, requestData.from), requestData);
      }

      // Add the recipient to the requester's subcollection
      if (requestData.role === "mentor") {
        const menteesCollection = collection(
          doc(database, "users", requestData.from),
          "mentees",
        );
        await setDoc(doc(menteesCollection, recipientUid), {
          uid: recipientUid,
          timestamp: new Date(),
        });
      } else if (requestData.role === "mentee") {
        const mentorsCollection = collection(
          doc(database, "users", requestData.from),
          "mentors",
        );
        await setDoc(doc(mentorsCollection, recipientUid), {
          uid: recipientUid,
          timestamp: new Date(),
        });
      }

      // Remove the request from the requests collection
      await deleteDoc(requestDocRef);

      console.log("Request accepted successfully");
    } else {
      console.error("Request not found");
    }
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};

export default acceptRequest;

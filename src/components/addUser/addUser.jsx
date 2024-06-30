import React, { useState } from "react";
import avatarpic from "../chats/chat-images/avatar.png";
import "./addUser.css";
import { collection, query, where, doc, setDoc, getDocs, updateDoc, arrayUnion,  serverTimestamp } from "firebase/firestore";
import { db } from "../updateProfile/firebaseConfig";
import { useUserStore } from "../../lib/userStore";



const AddUser = () => {
  const [user, setUser] = useState(null);

  const {currentUser} = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("name", "==", name));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
    } else {
        setUser(null); // Clear the user if no match found
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async() => { 

    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")

    try { 
        const newChatRef = doc(chatRef)

        await setDoc(newChatRef, { 
            createdAt: serverTimestamp(), 
            messages: []
        }); 

        await updateDoc(doc(userChatsRef, user.id), { 
            chats: arrayUnion({
                chatId: newChatRef.id,
                lastMessage: "",
                receiverId: currentUser.id, 
                updatedAt: Date.now(),
            }),
            
        });

        await updateDoc(doc(userChatsRef, currentUser.id), { 
            chats: arrayUnion({
                chatId: newChatRef.id,
                lastMessage: "",
                receiverId: user.id, 
                updatedAt: Date.now(),
            }),
            
        });
        console.log(newChatRef.id)
    } catch (err) { 
        console.log(err);
    }
  }
  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="name" name="name" />
        <button>Search</button>
      </form>
      {user && <div className="user">
          <div className="detail">
            <img src={user.avatar || avatarpic} alt="" />
            <span>{user.name}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      }
    </div>
  );
};

export default AddUser;

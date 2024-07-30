import { create } from "zustand";
import { useUserStore } from "./userStore";
import { doc } from "firebase/firestore";
import { db } from "../components/updateProfile/firebaseConfig";

export const useChatStore = create((set) => ({
  chatId: "",
  user: "",
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;
  },
}));

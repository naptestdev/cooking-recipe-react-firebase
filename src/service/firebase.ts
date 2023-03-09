import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9JbvZyjJQX7uGIAgjGOME8pBfMx5HJNM",
  authDomain: "cooking-recipe-61013.firebaseapp.com",
  projectId: "cooking-recipe-61013",
  storageBucket: "cooking-recipe-61013.appspot.com",
  messagingSenderId: "188911321852",
  appId: "1:188911321852:web:4c437ded9f07dc5e700d79",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

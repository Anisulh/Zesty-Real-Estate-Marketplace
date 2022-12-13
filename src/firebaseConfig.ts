import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB9p9j8jJZAeHUGLVpGzu8W92k1hHHcVTA",
  authDomain: "marketplace-real-estate.firebaseapp.com",
  projectId: "marketplace-real-estate",
  storageBucket: "marketplace-real-estate.appspot.com",
  messagingSenderId: "446741333957",
  appId: "1:446741333957:web:7ef90cefb47580616eedac",
  measurementId: "G-VWTGDX80YS"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
getAuth(app);
export const db = getFirestore(app);
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInWithEmailLink,
} from "firebase/auth";
import { NavigateFunction } from "react-router-dom";

export const isNewlyRegistered = async (navigate: NavigateFunction) => {
  const auth = getAuth();
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email: string | null = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    } else {
      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem("emailForSignIn");
        onAuthStateChanged(auth, (user) => {
          if (user) {
            navigate("/");
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};

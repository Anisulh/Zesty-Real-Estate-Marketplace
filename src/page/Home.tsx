import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useEffect } from "react";
import { ListingType } from "../types";

function Home() {
  const [rentListings, setRentListings] = useState<ListingType[]>([]);
  const [saleListings, setSaleListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(true);
  // Confirm the link is a sign-in with email link.
  const auth = getAuth();
  useEffect(() => {
    const checkNewRegistration = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email: string | null =
          window.localStorage.getItem("emailForSignIn");
        if (!email) {
          email = window.prompt("Please provide your email for confirmation");
        } else {
          try {
            const result = await signInWithEmailLink(
              auth,
              email,
              window.location.href
            );
            window.localStorage.removeItem("emailForSignIn");
          } catch (error) {
            console.log(error);
          }
        }
      }
    };
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const saleQuery = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const rentQuery = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const saleQuerySnap = await getDocs(saleQuery);
        const rentQuerySnap = await getDocs(rentQuery);
        const tempSaleListings:
          | ((prevState: never[]) => never[])
          | { id: string; data: DocumentData }[] = [];
        const tempRentListings:
          | ((prevState: never[]) => never[])
          | { id: string; data: DocumentData }[] = [];
        saleQuerySnap.forEach((doc) => {
          return tempSaleListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        rentQuerySnap.forEach((doc) => {
          return tempRentListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(tempSaleListings);
        setRentListings(tempRentListings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    checkNewRegistration();
    fetchListings();
  }, []);

  return <div>Home</div>;
}

export default Home;

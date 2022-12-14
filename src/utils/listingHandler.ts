import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { db } from "../firebaseConfig";
import { ListingType } from "../types";

export const fetchListings = async (
  setSaleListings: Dispatch<SetStateAction<ListingType[]>>,
  setRentListings: Dispatch<SetStateAction<ListingType[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
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

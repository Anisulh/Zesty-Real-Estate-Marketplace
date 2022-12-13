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
import { ListingType, StatusType } from "../types";
import { Box, Container, Stack } from "@mui/system";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { IconButton, TextField, Typography } from "@mui/material";
import ListingCard from "../components/ListingCard";
import Spinner from "../components/Spinner";
import Status from "../components/Status";
import SearchIcon from "@mui/icons-material/Search";

function Home() {
  const [rentListings, setRentListings] = useState<ListingType[]>([]);
  const [saleListings, setSaleListings] = useState<ListingType[]>([]);
  const [status, setStatus] = useState<StatusType>({
    open: false,
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(true);
  // Confirm the link is a sign-in with email link.
  const auth = getAuth();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutoComplete(autocomplete);
  };

  const onPlaceChanged = async () => {
    if (autoComplete !== null) {
      const address = autoComplete.getPlace().formatted_address;
      if (address) {
        console.log(address);
      }
    } else {
      console.log("autocomplete is not loaded yet");
    }
  };
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
  const handleStatusClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setStatus({
      open: false,
      error: false,
      message: "",
    });
  };

  if (loading || !isLoaded) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="md">
      {status && <Status status={status} handleClose={handleStatusClose} />}
      <Box>
        <Typography variant="h2" component="h2">
          Know what your looking for?
        </Typography>
        <form>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <TextField
              sx={{ width: "400px", margin: "5px" }}
              type="text"
              name="address"
              label="Address"
              placeholder="Address"
              required
            />
          </Autocomplete>
          <IconButton type="submit">
            <SearchIcon />
          </IconButton>
        </form>
      </Box>
      <Box>
        <Typography variant="h4" component="h2">
          Most Recent Sale Listings
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          {saleListings &&
            saleListings.map((listing) => {
              return <ListingCard key={listing.id} listing={listing} />;
            })}
        </Stack>
      </Box>
      <Box>
        <Typography variant="h4" component="h2">
          Most Recent Rent Listings
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          {rentListings &&
            rentListings.map((listing) => {
              return <ListingCard key={listing.id} listing={listing} />;
            })}
        </Stack>
      </Box>
    </Container>
  );
}

export default Home;

import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Container from "@mui/material/Container";
import Stack from "@mui/system/Stack";
import { useLoadScript } from "@react-google-maps/api";
import {
  collection,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import Map from "../components/Map";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";
import { db } from "../firebaseConfig";
import {
  ISearchQueries,
  Libraries,
  ListingType,
  SelectedLocationType,
} from "../types";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [libraries] = useState<Libraries>(["places"]);
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisibleListing, setLastVisibleListing] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: libraries,
  });
  const [selected, setSelected] = useState<SelectedLocationType>({
    lat: 39.9,
    lng: -75.17,
  });
  const [searchQueries, setSearchQueries] = useState<ISearchQueries>({
    type: searchParams.get("type") ?? "sale",
    homeType: "singleFamily",
    bedrooms: null,
    bathrooms: null,
  });
  const { type, homeType } = searchQueries;
  useEffect(() => {
    const fetchListings = async () => {
      console.log(searchParams.get("type"));
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", type),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const querySnap = await getDocs(q);
        const lastListing = querySnap.docs[querySnap.docs.length - 1];
        setLastVisibleListing(lastListing);
        const listing: ListingType[] = [];
        querySnap.forEach((doc) => {
          return listing.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listing);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }, [type]);

  if (!isLoaded || loading) return <Spinner />;
  return (
    <Container maxWidth="xl">
      <SearchBar
        setSelected={setSelected}
        searchQueries={searchQueries}
        setSearchQueries={setSearchQueries}
      />
      <Stack direction="row">
        <Map selected={selected} />
        <Container>
          <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
            Results
          </Typography>
          <Grid2 container spacing={3}>
            {listings.length > 0 ? (
              listings.map((listing: ListingType) => {
                return (
                  <Grid2 xs={6}>
                    <ListingCard listing={listing} key={listing.id} />
                  </Grid2>
                );
              })
            ) : (
              <Typography>
                Looks like theres no listing that matches your criteria
              </Typography>
            )}
          </Grid2>
        </Container>
      </Stack>
    </Container>
  );
}

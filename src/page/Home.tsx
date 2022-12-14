import { useState } from "react";
import { useEffect } from "react";
import { ListingType, StatusType } from "../types";
import Box from "@mui/system/Box";
import Container from "@mui/system/Container";
import Stack from "@mui/system/Stack";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ListingCard from "../components/ListingCard";
import Spinner from "../components/Spinner";
import Status from "../components/Status";
import SearchIcon from "@mui/icons-material/Search";
import { isNewlyRegistered } from "../utils/authHandler";
import { fetchListings } from "../utils/listingHandler";
import { useNavigate } from "react-router-dom";
import { handleStatusClose } from "../utils/statusHandler";

function Home() {
  const navigate = useNavigate();
  const [rentListings, setRentListings] = useState<ListingType[]>([]);
  const [saleListings, setSaleListings] = useState<ListingType[]>([]);
  const [status, setStatus] = useState<StatusType>({
    open: false,
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(true);
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
    isNewlyRegistered(navigate);
  }, []);

  useEffect(() => {
    fetchListings(setSaleListings, setRentListings, setLoading);
  }, []);

  if (loading || !isLoaded) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="md">
      {status && (
        <Status
          status={status}
          setStatus={setStatus}
          handleClose={handleStatusClose}
        />
      )}
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

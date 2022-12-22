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
import {
  createTheme,
  Divider,
  FilledInput,
  FormControl,
  InputAdornment,
  InputLabel,
  Paper,
  ThemeProvider,
} from "@mui/material";

import herobg from "../assets/images/herobg.jpg";

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
  const heroBG = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: `url(${herobg})`,
            height: "500px" /* You must set a specified height */,
            backgroundPosition: "top left" /* Center the image */,
            backgroundRepeat: "no-repeat" /* Do not repeat the image */,
            backgroundSize:
              "150%" /* Resize the background image to cover the entire container */,
            // filter: "blur(8px)",
          },
        },
      },
    },
  });

  const inputStyleOverride = createTheme({
    components: {
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: "rgb(232, 241, 250)",
            "&:hover": {
              backgroundColor: "rgb(250, 232, 241)",
              // Reset on touch devices, it doesn't add specificity
              "@media (hover: none)": {
                backgroundColor: "rgb(232, 241, 250)",
              },
            },
            "&.Mui-focused": {
              backgroundColor: "rgb(250, 241, 232)",
            },
          },
        },
      },
    },
  });

  if (loading || !isLoaded) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 2 }}>
      {status && (
        <Status
          status={status}
          setStatus={setStatus}
          handleClose={handleStatusClose}
        />
      )}
      <Box sx={{ position: "relative", height: "700px" }}>
        <ThemeProvider theme={heroBG}>
          <Paper elevation={2} sx={{ borderRadius: 5 }}>
            <Box pt={10} pl={5}>
              <Typography
                variant="h3"
                component="h2"
                sx={{ zIndex: 10, color: "white", fontWeight: 500 }}
              >
                Search Now For
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{ zIndex: 10, color: "white", fontWeight: 500, mb: 5 }}
              >
                a Better Tomarrow
              </Typography>
              <form>
                <Stack direction="row" alignItems="center">
                  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <ThemeProvider theme={inputStyleOverride}>
                      <FilledInput
                        sx={{
                          width: "40ch",
                          borderRadius: 2,
                          height: "40px",
                        }}
                        disableUnderline
                        type="search"
                        name="address"
                        required
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => console.log("hello")}
                              onMouseDown={() => console.log("hello")}
                              edge="end"
                            >
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </ThemeProvider>
                  </Autocomplete>
                </Stack>
              </form>
            </Box>
          </Paper>
        </ThemeProvider>
        <Paper
          sx={{ position: "absolute", bottom: "6%", mx: 3, borderRadius: 3 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "fit-content",
              py: 5,
              px: 2,
              "& svg": {
                m: 1.5,
              },
              "& hr": {
                mx: 2.5,
              },
            }}
          >
            <Box>
              <Typography
                variant="h5"
                component="h3"
                sx={{ fontWeight: 700, height: "80px" }}
              >
                Info At Your Fingertips
              </Typography>
              <Typography variant="body1" component="p">
                Be on top of all the listings that you create or the ones that
                you favorite. Never miss an opportunity to find your home.
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography
                variant="h5"
                component="h3"
                sx={{ fontWeight: 700, height: "80px" }}
              >
                Direct Contact
              </Typography>
              <Typography variant="body1" component="p">
                Stop wasting time waiting for an agent or broker and start
                taking the steps to take your search from dreaming about your
                home to actually living in it. Contact the seller directly to
                close the deal faster
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography
                variant="h5"
                component="h3"
                sx={{ fontWeight: 700, height: "80px" }}
              >
                Listing Homes Simplified
              </Typography>
              <Typography variant="body1" component="p">
                Zesty makes it easier than ever to list your homes. Don’t waste
                time and get your home in front of new eyes.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box>
        <Typography variant="h5" component="h3" sx={{ fontWeight: 700 }}>
          Take the First Step
        </Typography>
        <Typography variant="body1" component="p">
          Look at the newest homes available:
        </Typography>
        <Box p={4}>
          <Typography variant="h6" component="h4" sx={{ fontWeight: 700 }}>
            For Sale
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            {saleListings && saleListings.length > 0 ? (
              saleListings.map((listing) => {
                return <ListingCard key={listing.id} listing={listing} />;
              })
            ) : (
              <Typography variant="body1" component="p">
                Oh no! Looks like theres not listings
              </Typography>
            )}
          </Stack>
        </Box>
        <Box p={4}>
          <Typography variant="h6" component="h4" sx={{ fontWeight: 700 }}>
            For Rent
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            {rentListings && rentListings.length > 0 ? (
              rentListings.map((listing) => {
                return <ListingCard key={listing.id} listing={listing} />;
              })
            ) : (
              <Typography variant="body1" component="p">
                Oh no! Looks like theres not listings
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>

      {/* 
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
      </Box> */}
    </Container>
  );
}

export default Home;

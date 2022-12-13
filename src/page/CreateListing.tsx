import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeocodeResult, getGeocode, getLatLng } from "use-places-autocomplete";
import Spinner from "../components/Spinner";
import Status from "../components/Status";
import { ListingDataType, StatusType } from "../types";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();

  const isMounted = useRef(true);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [status, setStatus] = useState<StatusType>({
    open: false,
    error: false,
    message: "",
  });
  const [listingData, setListingData] = useState<ListingDataType>({
    type: "sell",
    homeType: "singleFamily",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 0,
    lotSize: 0,
    yearBuilt: 2000,
    lastStructuralRemodel: 2010,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: null,
    geoCode: {
      lat: 0,
      lng: 0,
    },
  });
  const {
    type,
    homeType,
    bedrooms,
    bathrooms,
    sqft,
    lotSize,
    yearBuilt,
    lastStructuralRemodel,
    parking,
    furnished,
    offer,
    regularPrice,
    description,
    discountedPrice,
    images,
    address,
    geoCode,
  } = listingData;

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setListingData({ ...listingData, userRef: user.uid });
        } else {
          navigate("/login");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, navigate]);

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
  const [loading, setLoading] = useState(false);
  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (discountedPrice && discountedPrice >= regularPrice) {
      setLoading(false);
      setStatus({
        open: true,
        error: true,
        message: "Offer price is higher or equal to regular price",
      });
      return;
    }
    if (images?.length && images?.length > 6) {
      setLoading(false);
      setStatus({
        open: true,
        error: true,
        message: "There can only a max of 6 images",
      });
      return;
    }
    if (listingData.geoCode.lat === 0 || listingData.geoCode.lng === 0) {
      setLoading(false);
      setStatus({
        open: true,
        error: true,
        message: "Address not entered, try again",
      });
      return;
    }

    // Store image in firebase
    const storeImage = async (image: any) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [{ ...images }].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      setStatus({ open: true, error: true, message: "Images not uploaded" });
      return;
    });

    const tempListingData = {
      ...listingData,
      imgUrls,
      timestamp: serverTimestamp(),
    };

    delete tempListingData.images;
    !tempListingData.offer && delete tempListingData.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), tempListingData);
    setLoading(false);
    setStatus({ open: true, error: false, message: "Listing saved" });
    navigate(`/listing}/${docRef.id}`);
  };
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutoComplete(autocomplete);
  };

  const onPlaceChanged = async () => {
    if (autoComplete !== null) {
      const address = autoComplete.getPlace().formatted_address;
      if (address) {
        const input: google.maps.GeocoderRequest = { address };
        const results = await getGeocode(input);
        const { lat, lng } = await getLatLng(results[0]);
        setListingData((prevState) => ({
          ...prevState,
          address,
          geoCode: {
            lat,
            lng,
          },
        }));
      }
    } else {
      console.log("autocomplete is not loaded yet");
    }
  };
  const onFormChange = (e: any) => {
    console.log("changing");
    let boolean: boolean | null = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setListingData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setListingData((prevState) => ({
        ...prevState,
        [e.target.name]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading || !isLoaded) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="md">
      {status ? (
        <Status status={status} handleClose={handleStatusClose} />
      ) : (
        <></>
      )}
      <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
        Create Listing
      </Typography>
      <form onSubmit={onFormSubmit}>
        <Typography variant="h6" component="h3">
          Sell or Rent?
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <ToggleButton
            name="type"
            color="primary"
            size="large"
            value="sell"
            onChange={(e) => onFormChange(e)}
            selected={type === "sell" ? true : false}
          >
            Sell
          </ToggleButton>
          <ToggleButton
            name="type"
            value="rent"
            color="primary"
            size="large"
            selected={type === "rent" ? true : false}
            onChange={(e) => onFormChange(e)}
          >
            Rent
          </ToggleButton>
        </Stack>
        <Typography variant="h6" component="h3">
          Address
        </Typography>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <TextField
              sx={{ width: "400px", margin: "5px" }}
              type="text"
              name="address"
              label="Address"
              placeholder="Address"
              onChange={onFormChange}
              required
            />
          </Autocomplete>
          <TextField
            sx={{ width: "400px", margin: "5px" }}
            type="text"
            name="unitNumber"
            label="Unit Number"
            id="unitNumber"
            onChange={onFormChange}
            placeholder="Unit # (optional)"
          />
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <TextField
            sx={{ width: "400px", margin: "5px", marginBottom: "30px" }}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            label={type === "rent" ? "Price per Month" : "Price"}
            placeholder="1,000,000"
            name="regularPrice"
            id="regularPrice"
            value={regularPrice}
            onChange={onFormChange}
            required
          />
        </Stack>
        <Typography variant="h6" component="h3">
          Any Offer or Discount?
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <ToggleButton
            name="offer"
            selected={offer}
            value={"true"}
            onChange={(e) => onFormChange(e)}
            size="large"
            color="primary"
          >
            Yes
          </ToggleButton>
          <ToggleButton
            name="offer"
            selected={!offer}
            value={"false"}
            onChange={(e) => onFormChange(e)}
            size="large"
            color="primary"
          >
            No
          </ToggleButton>
        </Stack>
        {offer && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <TextField
              sx={{ width: "400px", margin: "5px", marginBottom: "30px" }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                min: 50,
                max: 100000000000000,
              }}
              label={type === "rent" ? "Offer Price per Month" : "Offer Price"}
              name="discountedPrice"
              id="discountedPrice"
              value={discountedPrice}
              onChange={onFormChange}
              required={offer}
            />
          </Stack>
        )}
        <Typography variant="h6" component="h3">
          What type of home is it?
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Select
            sx={{ width: "400px", margin: "5px", marginBottom: "30px" }}
            displayEmpty
            label="heloow"
            name="homeType"
            value={homeType}
            onChange={() => onFormChange}
          >
            <MenuItem value="singleFamily">Single Family</MenuItem>
            <MenuItem value="condo">Condo</MenuItem>
            <MenuItem value="multiFamily">Multi Family</MenuItem>
            <MenuItem value="townhouse">Townhouse</MenuItem>
            <MenuItem value="coop">Co-Op Unit</MenuItem>
            <MenuItem value="apartment">Apartment</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </Stack>

        <div>
          <Typography variant="h6" component="h3">
            Number of rooms?
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <TextField
              sx={{ width: "100px", margin: "5px", marginBottom: "30px" }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                max: 50,
                min: 1,
              }}
              label="Bedrooms"
              name="bedrooms"
              id="bedrooms"
              value={bedrooms}
              onChange={onFormChange}
              required
            />

            <TextField
              sx={{ width: "100px", margin: "5px", marginBottom: "30px" }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                max: 50,
                min: 1,
              }}
              label="Bathrooms"
              id="bathrooms"
              value={bathrooms}
              onChange={onFormChange}
              required
            />
          </Stack>
        </div>
        <Typography variant="h6" component="h3">
          When was it built and remodeled?
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <TextField
            sx={{ width: "100px", margin: "5px", marginBottom: "30px" }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              max: new Date().getFullYear(),
              min: 1,
            }}
            label="Year Built:"
            name="yearBuilt"
            id="yearBuilt"
            value={yearBuilt}
            onChange={onFormChange}
            required
          />

          <TextField
            sx={{ width: "100px", margin: "5px", marginBottom: "30px" }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              max: new Date().getFullYear(),
              min: 1,
            }}
            label="Last Structural Remodel:"
            name="lastStructuralRemodel"
            id="lastStructuralRemodel"
            value={lastStructuralRemodel}
            onChange={onFormChange}
            required
          />
        </Stack>
        <Typography variant="h6" component="h3">
          How large is the home?
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <TextField
            sx={{ width: "100px", margin: "5px", marginBottom: "30px" }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              max: new Date().getFullYear(),
              min: 1,
            }}
            label="Sqft:"
            name="sqft"
            value={sqft}
            onChange={onFormChange}
            required
          />
          {homeType === "singleFamily" ||
          homeType === "multiFamily" ||
          homeType === "townhouse" ? (
            <TextField
              sx={{ width: "100px", margin: "5px", marginBottom: "30px" }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                max: new Date().getFullYear(),
                min: 1,
              }}
              label="Lot Size:"
              name="lotSize"
              value={lotSize}
              onChange={onFormChange}
              required
            />
          ) : (
            <></>
          )}
        </Stack>
        <Typography variant="h6" component="h3">
          Private parking?
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <ToggleButton
            name="parking"
            selected={parking}
            value={true}
            onChange={(e) => onFormChange(e)}
            size="large"
            color="primary"
          >
            Yes
          </ToggleButton>
          <ToggleButton
            name="parking"
            selected={!parking}
            value={false}
            onChange={(e) => onFormChange(e)}
            size="large"
            color="primary"
          >
            No
          </ToggleButton>
        </Stack>
        <Typography variant="h6" component="h3">
          Already furnished?
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <ToggleButton
            name="furnished"
            selected={furnished}
            value={true}
            onChange={(e) => onFormChange(e)}
            size="large"
            color="primary"
          >
            Yes
          </ToggleButton>
          <ToggleButton
            name="furnished"
            selected={!furnished}
            value={false}
            onChange={(e) => onFormChange(e)}
            size="large"
            color="primary"
          >
            No
          </ToggleButton>
        </Stack>
        <Typography variant="h6" component="h3">
          Description:
        </Typography>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <TextField
            sx={{ width: "400px", margin: "5px", marginBottom: "30px" }}
            multiline
            label="Description"
            name="description"
            onChange={onFormChange}
            value={description}
            required
          />
        </Stack>

        <Box mb={5}>
          <Typography variant="h6" component="h3">
            Images:
          </Typography>
          <Typography variant="body1" component="p">
            The first image will be the cover (max 6).
          </Typography>
          <input
            type="file"
            name="images"
            id="images"
            onChange={onFormChange}
            max={6}
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
        </Box>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          sx={{ my: 10 }}
        >
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default CreateListing;

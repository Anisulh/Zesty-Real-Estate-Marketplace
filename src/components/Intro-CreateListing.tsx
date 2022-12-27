import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import Container from "@mui/system/Container";
import Stack from "@mui/system/Stack";
import { Autocomplete } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { CreateListingFormProps } from "../types";

function IntroForm(props: CreateListingFormProps) {
  const { listingData, setListingData, onFormChange, setStepComplete } = props;
  const { type, regularPrice, offer, discountedPrice, unitNumber } =
    listingData;
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);

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
        if (setListingData) {
          console.log("setting autocompletw");
          setListingData((prevState) => ({
            ...prevState,
            address,
            geoCode: {
              lat,
              lng,
            },
          }));
        }
      }
    } else {
      console.log("autocomplete is not loaded yet");
    }
  };

  useEffect(() => {
    if (type && regularPrice && regularPrice > 0) {
      if (offer && discountedPrice && discountedPrice > 0) {
        setStepComplete(true);
      } else if (!offer) {
        setStepComplete(true);
      } else {
        setStepComplete(false);
      }
    } else {
      setStepComplete(false);
    }
  }, [type, regularPrice, offer, discountedPrice]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" component="h3" sx={{ fontWeight: "bold" }}>
        Introduce us
      </Typography>
      <Stack direction="column" gap={1} sx={{ mx: { xl: 40, lg: 25, md: 15 } }}>
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
              className="input"
              type="text"
              name="address"
              label="Address"
              placeholder="Address"
              onChange={onFormChange}
              required
            />
          </Autocomplete>
          {type === "rent" && (
            <TextField
              className="input"
              type="text"
              name="unitNumber"
              label="Unit Number"
              id="unitNumber"
              onChange={onFormChange}
              placeholder="Unit # (optional)"
            />
          )}
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <TextField
            className="input"
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
      </Stack>
    </Container>
  );
}

export default IntroForm;

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import Container from "@mui/system/Container";
import Stack from "@mui/system/Stack";
import { useEffect } from "react";
import { CreateListingFormProps } from "../types";

function SpecificationForm(props: CreateListingFormProps) {
  const { listingData, onFormChange, setStepComplete } = props;
  const {
    homeType,
    bedrooms,
    bathrooms,
    yearBuilt,
    lotSize,
    sqft,
    lastStructuralRemodel,
    furnished,
    parking,
  } = listingData;
  useEffect(() => {
    if (
      homeType &&
      bedrooms &&
      bedrooms > 0 &&
      bathrooms &&
      bathrooms > 0 &&
      yearBuilt &&
      yearBuilt > 1800 &&
      lotSize &&
      lotSize > 0 &&
      sqft &&
      sqft > 0 &&
      lastStructuralRemodel &&
      lastStructuralRemodel > 0 &&
      lastStructuralRemodel > yearBuilt
    ) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  }, [
    homeType,
    bedrooms,
    bathrooms,
    yearBuilt,
    lotSize,
    sqft,
    lastStructuralRemodel,
  ]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" component="h3" sx={{ fontWeight: "bold" }}>
        Specifications
      </Typography>
      <Stack direction="column" gap={1} sx={{ mx: { xl: 40, lg: 25, md: 15 } }}>
        <Typography variant="h6" component="h3">
          Type of home?
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Select
            className="input"
            sx={{ width: "400px", margin: "5px", marginBottom: "30px" }}
            displayEmpty
            label="heloow"
            name="homeType"
            value={homeType}
            onChange={onFormChange}
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
              className="input"
              sx={{ width: "100px", margin: "5px", marginBottom: "30px" }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                max: 50,
                min: 1,
              }}
              label="Bedrooms"
              name="bedrooms"
              value={bedrooms}
              onChange={onFormChange}
              required
            />

            <TextField
              className="input"
              sx={{ width: "100px", margin: "5px", marginBottom: "30px" }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                max: 50,
                min: 1,
              }}
              label="Bathrooms"
              name="bathrooms"
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
            className="input"
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
            className="input"
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
            className="input"
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
              className="input"
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
            sx={{ borderRadius: "10px", py: 1, px: 2 }}
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
            sx={{ borderRadius: "10px", py: 1, px: 2 }}
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
            sx={{ borderRadius: "10px", py: 1, px: 2 }}
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
            sx={{ borderRadius: "10px", py: 1, px: 2 }}
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
      </Stack>
    </Container>
  );
}

export default SpecificationForm;

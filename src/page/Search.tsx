import Typography from "@mui/material/Typography";
import Container from "@mui/system/Container";
import Stack from "@mui/system/Stack";
import { useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import Map from "../components/Map";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";
import { SelectedLocationType } from "../types";

const places = "places";
export default function Search() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: [places],
  });
  const [selected, setSelected] = useState<SelectedLocationType>({
    lat: 39.9,
    lng: -75.17,
  });
  if (!isLoaded) return <Spinner />;
  return (
    <Container>
      <SearchBar setSelected={setSelected} />
      <Stack direction="row">
        <Map selected={selected} />
        <Container>
          <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
            Results
          </Typography>
        </Container>
      </Stack>
    </Container>
  );
}

import Container from "@mui/system/Container";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useMemo } from "react";
import { MapProps } from "../types";

export default function Map(props: MapProps) {
  const center = useMemo(() => props.selected, [props.selected]);

  return (
    <Container>
      <GoogleMap
        zoom={12}
        center={center}
        mapContainerClassName="map-container"
      >
        {props.selected && <MarkerF position={center} />}
      </GoogleMap>
    </Container>
  );
}

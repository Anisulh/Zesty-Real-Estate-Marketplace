import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";
import { FormEvent, useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { SearchBarProps } from "../types";
import { Autocomplete } from "@react-google-maps/api";
import TextField from "@mui/material/TextField";

export default function SearchBar(props: SearchBarProps) {
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutoComplete(autocomplete);
  };

  const onPlaceChanged = async () => {
    if (autoComplete !== null) {
      const address = autoComplete.getPlace().formatted_address;
      console.log(address);
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      props.setSelected({ lat, lng });
    } else {
      console.log("autocomplete is not loaded yet");
    }
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <form onSubmit={onFormSubmit}>
        <MenuItem onClick={handleProfileMenuOpen}>
          <Button type="submit" variant="contained" size="small">
            Filter
          </Button>
        </MenuItem>
      </form>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", color: "black" }}
        elevation={0}
      >
        <Toolbar>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <TextField type="text" label="Search" sx={{ width: "40ch" }} />
          </Autocomplete>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <form onSubmit={onFormSubmit}>
              <Button type="submit" variant="contained" size="small">
                Filter
              </Button>
            </form>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <TuneIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}

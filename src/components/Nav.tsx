import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Container } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAuth, signOut } from "firebase/auth";
import { Avatar, Divider, ListItemIcon } from "@mui/material";
import { Logout } from "@mui/icons-material";
import VillaIcon from "@mui/icons-material/Villa";
import { paperPropStyle } from "../styles";
import SellIcon from "@mui/icons-material/Sell";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonIcon from "@mui/icons-material/Person";

function Nav() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const onLogout = async () => {
    await signOut(auth);
    handleMenuClose();
    navigate("/");
  };
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      open={isMenuOpen}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      PaperProps={paperPropStyle}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={() => navigate("/profile")}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={() => navigate("/mylistings")}>
        <ListItemIcon>
          <VillaIcon fontSize="small" />
        </ListItemIcon>
        My Listings
      </MenuItem>
      <Divider />

      <MenuItem onClick={onLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      onClick={handleMobileMenuClose}
      PaperProps={paperPropStyle}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <MenuItem onClick={() => navigate("/search")}>
        <ListItemIcon>
          <VillaIcon fontSize="small" />
        </ListItemIcon>
        <p className="mobileLink">Buy</p>
      </MenuItem>
      <MenuItem onClick={() => navigate("/create-listing")}>
        <ListItemIcon>
          <SellIcon fontSize="small" />
        </ListItemIcon>
        <p className="mobileLink">Sell</p>
      </MenuItem>
      <MenuItem onClick={() => navigate("/search")}>
        <ListItemIcon>
          <ApartmentIcon fontSize="small" />
        </ListItemIcon>
        <p className="mobileLink">Rent</p>
      </MenuItem>

      <MenuItem onClick={() => navigate("/profile")}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={() => navigate("/mylistings")}>
        <ListItemIcon>
          <VillaIcon fontSize="small" />
        </ListItemIcon>
        My Listings
      </MenuItem>
      <Divider />
      <MenuItem onClick={onLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Container maxWidth="xl" sx={{ flexGrow: 1, py: 1 }}>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar>
          <Link to={"/"} className="logo">
            Zesty
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Link to={"/search"} className="navLink">
              Buy
            </Link>
            <Link to={"/create-listing"} className="navLink">
              Sell
            </Link>
            <Link to={"/search"} className="navLink">
              Rent
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {loggedIn ? (
              <Avatar
                src={
                  auth.currentUser?.photoURL ??
                  "https://image.shutterstock.com/image-vector/vector-avatar-icon-260nw-383411185.jpg"
                }
                onClick={handleProfileMenuOpen}
              />
            ) : (
              <div className="authGroup">
                <Link to="/login" className="navLink login">
                  Login
                </Link>
                <div className="authGroup-register">
                  <Link to="/register" className="navLink register">
                    Register
                  </Link>
                </div>
              </div>
            )}
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
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Container>
  );
}

export default Nav;

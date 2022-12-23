import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CreateIcon from "@mui/icons-material/Create";
import LoginIcon from "@mui/icons-material/Login";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { Container } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAuth, signOut } from "firebase/auth";

function Nav() {
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const onLogout = async () => {
    const auth = getAuth();
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
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/profile");
        }}
      >
        Profile
      </MenuItem>
      <MenuItem onClick={onLogout}>Log Out</MenuItem>
    </Menu>
  );

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
      {loggedIn ? (
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      ) : (
        <Box>
          <MenuItem>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={() => navigate("/register")}
            >
              <CreateIcon />
            </IconButton>
            <p>Register</p>
          </MenuItem>
          <MenuItem>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={() => navigate("/login")}
            >
              <LoginIcon />
            </IconButton>
            <p>Login</p>
          </MenuItem>
        </Box>
      )}

      {/* */}
    </Menu>
  );

  return (
    <Container maxWidth="xl" sx={{ flexGrow: 1, py: 1 }}>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar>
          <Link to={"/"} className="logo">Zesty</Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" }, pl: "85px" }}>
            <Link to={"/search"} className="navLink">
              Buy
            </Link>
            <Link to={"/search"} className="navLink">
              Sell
            </Link>
            <Link to={"/search"} className="navLink">
              Rent
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {loggedIn ? (
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
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
              <MoreIcon />
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

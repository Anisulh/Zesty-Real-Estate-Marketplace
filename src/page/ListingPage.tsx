import {
  Button,
  createTheme,
  Divider,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { useState } from "react";
import herobg from "../assets/images/herobg.jpg";

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
function ListingPage() {
  const [showMore, setShowMore] = useState(false);
  const listingBG = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: `url(${herobg})`,
            height: "500px",
            backgroundPosition: "top left",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%",
          },
        },
      },
    },
  });
  return (
    <Container maxWidth="lg" sx={{ mb: 10 }}>
      <ThemeProvider theme={listingBG}>
        <Paper elevation={0} sx={{ borderRadius: "10px" }} />
      </ThemeProvider>

      <Stack direction="row" justifyContent="space-between" pt={2}>
        <Box>
          <Typography variant="h4" component="div" sx={{ fontSize: "38px" }}>
            $699,999
          </Typography>
          <Stack direction="row" spacing={1}>
            <Typography
              sx={{
                width: "fit-content",
                padding: "4px 10px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BedIcon sx={{ marginRight: "5px" }} fontSize="small" /> 3
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Typography
              sx={{
                width: "fit-content",
                padding: "4px 10px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BathtubIcon sx={{ marginRight: "5px" }} fontSize="small" /> 3
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Typography
              sx={{
                width: "fit-content",
                padding: "4px 10px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SquareFootIcon fontSize="small" sx={{ marginRight: "5px" }} />
              3m&sup2;
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography
            variant="h4"
            component="p"
            sx={{ fontSize: "24px", fontWeight: "light" }}
          >
            11635 155th Street
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ fontSize: "20px", fontWeight: "light" }}
          >
            Jamaica, NY 11434
          </Typography>
        </Box>
      </Stack>
      <Box>
        <Typography variant="h5" component="h3" sx={{ mt: 4 }}>
          Description
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ mt: 1, color: "#4D4C4C", px: 5 }}
        >
          {text.length > 300 && !showMore ? text.slice(0, 300) + "..." : text}
        </Typography>
        {text.length > 300 && showMore ? (
          <Button sx={{ mx: 4 }} onClick={() => setShowMore(false)}>
            Show less
          </Button>
        ) : text.length > 300 && !showMore ? (
          <Button sx={{ mx: 4 }} onClick={() => setShowMore(true)}>
            Show more
          </Button>
        ) : (
          <></>
        )}
      </Box>
      <Box>
        <Typography variant="h5" component="h3" sx={{ mt: 4 }}>
          Specifications
        </Typography>
        <Stack direction="row" justifyContent="space-evenly" mt={4}>
          <Stack direction="column" gap={2}>
            <Typography variant="body1" component="p">
              Type:
            </Typography>
            <Typography variant="body1" component="p">
              Heating & Cooling:
            </Typography>
            <Typography variant="body1" component="p">
              Bedrooms:
            </Typography>
            <Typography variant="body1" component="p">
              Bathrooms:
            </Typography>
            <Typography variant="body1" component="p">
              Lot Size:
            </Typography>
            <Typography variant="body1" component="p">
              Year Built:
            </Typography>
            <Typography variant="body1" component="p">
              Last Remodel:
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack direction="column" gap={2}>
            <Typography variant="body1" component="p">
              Single Family
            </Typography>
            <Typography variant="body1" component="p">
              A/C
            </Typography>
            <Typography variant="body1" component="p">
              3
            </Typography>
            <Typography variant="body1" component="p">
              2
            </Typography>
            <Typography variant="body1" component="p">
              2100 ft&sup2;
            </Typography>
            <Typography variant="body1" component="p">
              1910
            </Typography>
            <Typography variant="body1" component="p">
              2001
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}

export default ListingPage;

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Divider, IconButton, Stack } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { ListingProps } from "../types";
import house from "../assets/images/house.jpg";
import { Box } from "@mui/system";

function ListingCard(props: ListingProps) {
  const [favorite, setFavorite] = useState(false);
  return (
    <Box sx={{ position: "relative" }}>
      <Card sx={{ maxWidth: 400, borderRadius: "20px", p: 1 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="175"
            image={house}
            alt="house"
            sx={{ borderRadius: "20px" }}
          />
          <CardContent sx={{ pt: 0, px: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontSize: "25px" }}>
              $699,999
            </Typography>
            <Typography variant="body1" component="p">
              11635 155th Street
            </Typography>
            <Typography variant="body1" component="p" sx={{ fontSize: "14px" }}>
              Jamaica, NY 11434
            </Typography>
            <Typography
              variant="h6"
              sx={{
                backgroundColor: "#378805",
                color: "white",
                borderRadius: "8px",
                width: "fit-content",
                padding: "4px 8px",
                fontSize: "14px",
                position: "absolute",
                top: 10,
                left: 10,
              }}
            >
              New
            </Typography>
            <Typography
              variant="h6"
              sx={{
                backgroundColor: "#468fd1",
                color: "white",
                borderRadius: "8px",
                width: "fit-content",
                padding: "4px 8px",
                fontSize: "14px",
                position: "absolute",
                top: 10,
                left: 60,
              }}
            >
              For Sale
            </Typography>
            <Stack mt={1} direction="row" spacing={2} mx={2}>
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
                <BedIcon sx={{ marginRight: "5px" }} /> 3
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
                <BathtubIcon sx={{ marginRight: "5px" }} /> 3
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
                <SquareFootIcon sx={{ marginRight: "5px" }} />
                3m&sup2;
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      <IconButton
        aria-label="Favorite Button"
        onClick={() => setFavorite(!favorite)}
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
          backgroundColor: "white",
          borderRadius: "5px",
          color: favorite ? "red" : "gray",
        }}
      >
        <FavoriteIcon />
      </IconButton>
    </Box>
  );
}

export default ListingCard;

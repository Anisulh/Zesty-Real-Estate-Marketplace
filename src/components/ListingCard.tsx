import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, IconButton, Stack } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { ListingProps } from "../types";

function ListingCard(props: ListingProps) {
  const [favorite, setFavorite] = useState(false);
  return (
    <Card sx={{ maxWidth: 345, borderRadius: "20px" }}>
      <CardActionArea>
        {/* <CardMedia
          component="img"
          height="150"
          image={house}
          alt="house"
          sx={{ borderRadius: "0 0 20px 20px" }}
        /> */}
        <CardContent>
          <IconButton
            aria-label="Favorite Button"
            onClick={() => setFavorite(!favorite)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "white",
              borderRadius: "5px",
              color: favorite ? "red" : "gray",
            }}
          >
            <FavoriteIcon />
          </IconButton>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ fontSize: "25px" }}
          >
            $699,999
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
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
          <Stack mt={2} direction="row" spacing={2}>
            <Typography
              sx={{
                backgroundColor: "lightgray",
                color: "black",
                borderRadius: "8px",
                width: "fit-content",
                padding: "4px 10px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BedIcon sx={{ color: "brown", marginRight: "5px" }} /> 3
            </Typography>
            <Typography
              sx={{
                backgroundColor: "lightgray",
                color: "black",
                borderRadius: "8px",
                width: "fit-content",
                padding: "4px 10px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BathtubIcon sx={{ color: "#468fd1", marginRight: "5px" }} /> 3
            </Typography>
            <Typography
              sx={{
                backgroundColor: "lightgray",
                color: "black",
                borderRadius: "8px",
                width: "fit-content",
                padding: "4px 10px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SquareFootIcon sx={{ color: "#468fd1", marginRight: "5px" }} />{" "}
              3m&sup2;
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ListingCard;

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
import { Box } from "@mui/system";

function ListingCard(props: ListingProps) {
  const { listing } = props;
  const { id, data } = listing;
  const [favorite, setFavorite] = useState(false);
  return (
    <Box sx={{ position: "relative" }}>
      <Card sx={{ maxWidth: 400, borderRadius: "20px", p: 1 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="175"
            image={data.imgUrls[0]}
            alt="house"
            sx={{ borderRadius: "20px" }}
          />
          <CardContent sx={{ pt: 0, px: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: "25px" }}
              >
                ${Intl.NumberFormat("en-US").format(data.regularPrice)}
              </Typography>
              <Box pt={"5px"} sx={{ textAlign: "right" }}>
                <Typography variant="body1" component="p" fontWeight={"medium"}>
                  {data.address.substring(0, data.address.indexOf(","))}
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  sx={{ fontSize: "14px" }}
                >
                  {data.address.substring(data.address.indexOf(",") + 1)}
                </Typography>
              </Box>
            </Stack>

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
              For {data.type}
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
                <BedIcon sx={{ marginRight: "5px", color: "grey" }} />{" "}
                {data.bedrooms}
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
                <BathtubIcon sx={{ marginRight: "5px", color: "grey" }} />{" "}
                {data.bathrooms}
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
                <SquareFootIcon sx={{ marginRight: "5px", color: "grey" }} />
                {data.sqft}m&sup2;
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

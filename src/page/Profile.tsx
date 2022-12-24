import { AddRounded } from "@mui/icons-material";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

function Profile() {
  const auth = getAuth();
  const [profileData, setProfileData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  });
  const { name, email } = profileData;
  return (
    <Container maxWidth="md">
      <Stack direction="row" justifyContent="space-between" alignItems="start">
        <Stack direction="row" gap={5} alignItems="center">
          <Avatar sx={{ width: 150, height: 150 }}>
            <IconButton sx={{ width: 150, height: 150 }}>
              <AddRounded />
            </IconButton>
          </Avatar>
          <Stack direction="column">
            <Typography variant="h4" component="h3" sx={{ fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography variant="body2" component="p">
              {email}
            </Typography>
            <Typography variant="body2" component="p">
              Properties Listed:
            </Typography>
          </Stack>
        </Stack>
        <IconButton>
          <ModeEditOutlineOutlinedIcon />
        </IconButton>
      </Stack>

      <Box mt={5}>
        <Typography
          variant="h4"
          component="h3"
          sx={{ fontWeight: "bold", fontSize: "28px" }}
        >
          Favorited Properties:
        </Typography>
        <Stack direction="row" gap={2}>
          {/* Add Liked properites here */}
        </Stack>
      </Box>
      <Box mt={5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h4"
            component="h3"
            sx={{ fontWeight: "bold", fontSize: "28px" }}
          >
            Properties Listed:
          </Typography>
          <Box
            sx={{
              backgroundColor: "lightgray",
              borderRadius: "40px",
              color: "black",
            }}
          >
            <Button sx={{ color: "inherit", borderRadius: "40px" }}>
              {" "}
              See All
            </Button>
            <IconButton sx={{ backgroundColor: "#323232" }}>
              <AddRounded sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Stack>

        <Stack direction="row" gap={2}>
          {/* Add Liked properites here */}
        </Stack>
      </Box>
    </Container>
  );
}

export default Profile;

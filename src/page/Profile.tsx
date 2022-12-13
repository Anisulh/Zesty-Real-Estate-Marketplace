import { AddRounded } from "@mui/icons-material";
import { Avatar, IconButton, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { getAuth } from "firebase/auth";
import { useState } from "react";

function Profile() {
  const auth = getAuth();
  const [profileData, setProfileData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  });
  const { name, email } = profileData;
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
        Profile
      </Typography>
      <Stack direction="row" gap={5} alignItems="center">
        <Avatar sx={{ width: 90, height: 90 }}>
          <IconButton sx={{ width: 90, height: 90 }}>
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
      <Box mt={5}>
        <Typography variant="h4" component="h3" sx={{ fontWeight: "bold" }}>
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
          <Typography variant="h4" component="h3" sx={{ fontWeight: "bold" }}>
            Properties Listed:
          </Typography>
          <IconButton size="large">
            <AddRounded fontSize="large" />
          </IconButton>
        </Stack>

        <Stack direction="row" gap={2}>
          {/* Add Liked properites here */}
        </Stack>
      </Box>
    </Container>
  );
}

export default Profile;

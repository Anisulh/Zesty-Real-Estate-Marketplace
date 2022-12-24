import { AddRounded } from "@mui/icons-material";
import {
  Avatar,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { getAuth, updateEmail, updateProfile } from "firebase/auth";
import { ChangeEvent, FormEvent, useState } from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { StatusType } from "../types";
import Status from "../components/Status";
import { handleStatusClose } from "../utils/statusHandler";
import { useNavigate } from "react-router-dom";

interface EditProfileType {
  firstName: string;
  lastName: string;
  email: string;
}

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusType>({
    open: false,
    error: false,
    message: "",
  });
  const [profileData, setProfileData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  });
  const { name, email } = profileData;
  const [editProfile, setEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState<EditProfileType>({
    firstName: name?.split(" ")[0] ?? "",
    lastName: name?.split(" ")[1] ?? "",
    email: email ?? "",
  });
  const { firstName, lastName } = editProfileData;

  const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditProfileData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(editProfileData);
    if (auth.currentUser) {
      if (name !== `${firstName} ${lastName}`) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: `${firstName} ${lastName}`,
          });
        } catch (error) {
          setStatus({
            open: true,
            error: true,
            message: "Unable to update profile",
          });
        }
      }
      if (email !== editProfileData.email) {
        try {
          await updateEmail(auth.currentUser, editProfileData.email);
        } catch (error) {
          setStatus({
            open: true,
            error: true,
            message: "Unable to update profile",
          });
        }
      }
    }

    setEditProfile(false);
    navigate("/profile");
  };

  return (
    <Container maxWidth="md">
      {status && (
        <Status
          status={status}
          setStatus={setStatus}
          handleClose={handleStatusClose}
        />
      )}
      {editProfile ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          <form id="profileForm" onSubmit={onFormSubmit}>
            <Stack direction="row" gap={5} alignItems="center" mt={5}>
              <IconButton
                aria-label="upload picture"
                component="label"
                sx={{ width: 150, height: 150 }}
              >
                <AddRounded />
                <input hidden accept=".jpg,.png,.jpeg" type="file" />
              </IconButton>

              <Stack direction="column" gap={5}>
                <Stack direction="row" justifyContent="space-between" gap={5}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    required
                    value={firstName}
                    onChange={onFormChange}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    required
                    value={lastName}
                    onChange={onFormChange}
                  />
                </Stack>

                <TextField
                  label="Email"
                  name="email"
                  required
                  value={editProfileData.email}
                  onChange={onFormChange}
                />
              </Stack>
            </Stack>
          </form>
          <Stack direction="column" justifyContent="space-between">
            <Button type="button" onClick={() => setEditProfile(false)}>
              Cancel
            </Button>
            <Button type="submit" form="profileForm">
              Submit
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          <Stack direction="row" gap={5} alignItems="center">
            <Avatar sx={{ width: 150, height: 150 }}>
              <IconButton sx={{ width: 150, height: 150 }}>
                <AddRounded />
              </IconButton>
            </Avatar>
            <Stack direction="column">
              <Typography
                variant="h4"
                component="h3"
                sx={{ fontWeight: "bold" }}
              >
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
          <IconButton onClick={() => setEditProfile(true)}>
            <ModeEditOutlineOutlinedIcon />
          </IconButton>
        </Stack>
      )}

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
            <IconButton
              onClick={() => navigate("/create-listing")}
              sx={{ backgroundColor: "#323232" }}
            >
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

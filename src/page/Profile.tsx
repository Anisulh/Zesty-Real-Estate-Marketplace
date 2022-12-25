import AddRounded from "@mui/icons-material/AddRounded";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import Container from "@mui/system/Container";
import Stack from "@mui/system/Stack";
import { getAuth, updateEmail, updateProfile } from "firebase/auth";
import { FormEvent, useEffect, useState } from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { StatusType } from "../types";
import Status from "../components/Status";
import { handleStatusClose } from "../utils/statusHandler";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { uuidv4 } from "@firebase/util";

interface EditProfileType {
  firstName: string;
  lastName: string;
  email: string;
  picture: File | null;
}

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    picture: null,
  });
  const { firstName, lastName, picture } = editProfileData;
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);

  const onFormChange = (e: any) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
      setEditProfileData((prevState) => ({
        ...prevState,
        picture: e.target.files[0],
      }));
    } else {
      setEditProfileData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    if (picture) {
      setPictureUrl(URL.createObjectURL(picture));
    }
  }, [picture]);
  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(editProfileData);
    if (auth.currentUser) {
      setLoading(true);
      if (name !== `${firstName} ${lastName}`) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: `${firstName} ${lastName}`,
          });
        } catch (error) {
          setLoading(false);
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
          setLoading(false);
          setStatus({
            open: true,
            error: true,
            message: "Unable to update profile",
          });
        }
      }
      if (picture !== null) {
        // Store image in firebase
        try {
          const storage = getStorage();
          const fileName = `${auth.currentUser?.uid}-profileImg-${uuidv4()}`;

          const storageRef = ref(storage, "images/" + fileName);

          const uploadTask = uploadBytesResumable(storageRef, picture);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
                  break;
              }
            },
            (error) => {
              setLoading(false);
              setStatus({
                open: true,
                error: true,
                message: "Unable to update profile",
              });
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log(downloadURL);
                if (auth.currentUser) {
                  updateProfile(auth.currentUser, { photoURL: downloadURL });
                  setEditProfile(false);
                  setLoading(false);
                  navigate("/profile");
                }
              });
            }
          );
        } catch (error) {
          setLoading(false);
          setStatus({
            open: true,
            error: true,
            message: "Unable to update profile",
          });
        }
      }
    }
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
              {picture && pictureUrl ? (
                <Box sx={{ position: "relative", p: 1 }}>
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: -5, right: -5 }}
                    onClick={() => {
                      setEditProfileData((prevState) => ({
                        ...prevState,
                        picture: null,
                      }));
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <Avatar src={pictureUrl} sx={{ width: 150, height: 150 }} />
                </Box>
              ) : (
                <IconButton
                  aria-label="upload picture"
                  component="label"
                  sx={{ width: 150, height: 150 }}
                >
                  <AddRounded />
                  <input
                    hidden
                    accept=".jpg,.png,.jpeg"
                    type="file"
                    name="picture"
                    onChange={onFormChange}
                  />
                </IconButton>
              )}

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
            <Button
              type="button"
              onClick={() => {
                setEditProfile(false);
                setEditProfileData({
                  firstName: name?.split(" ")[0] ?? "",
                  lastName: name?.split(" ")[1] ?? "",
                  email: email ?? "",
                  picture: null,
                });
              }}
            >
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
            <Avatar
              src={
                auth.currentUser?.photoURL ??
                "https://image.shutterstock.com/image-vector/vector-avatar-icon-260nw-383411185.jpg"
              }
              sx={{ width: 150, height: 150 }}
            >
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

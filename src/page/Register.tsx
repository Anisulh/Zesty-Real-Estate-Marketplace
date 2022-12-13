import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import red from "@mui/material/colors/red";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";
import Box from "@mui/system/Box";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  passwordStrength,
  registerErrors,
  registerUserData,
  StatusType,
} from "../types";
import { Link, useNavigate } from "react-router-dom";
import {
  passwordStrengthValidation,
  registerFormValidation,
} from "../utils/formValidation";
import { StyledLinearProgress } from "../styles";
import Popper from "@mui/material/Popper";
import { ClickAwayListener } from "@mui/material";
import Status from "../components/Status";

function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<registerUserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<registerErrors>({
    firstNameError: { error: false, message: " " },
    lastNameError: { error: false, message: " " },
    emailError: { error: false, message: " " },
    passwordError: { error: false, message: " " },
    confirmPasswordError: { error: false, message: " " },
  });
  const [passwordStrength, setPasswordStrength] = useState<passwordStrength>({
    progress: 0,
    status: "",
    color: "",
  });
  const [status, setStatus] = useState<StatusType>({
    open: false,
    error: false,
    message: "",
  });
  const [popperAnchor, setPopperAnchor] = useState<HTMLElement | null>(null);
  const { firstName, lastName, email, password, confirmPassword } = userData;
  const {
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    confirmPasswordError,
  } = error;
  const [passwordsToggle, setPasswordsToggle] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const { showPassword, showConfirmPassword } = passwordsToggle;

  const onPopperOpen = (e: MouseEvent<HTMLElement>) => {
    setPopperAnchor(e.currentTarget);
  };
  const onPopperClose = () => {
    setPopperAnchor(null);
  };
  useEffect(() => {
    passwordStrengthValidation(password, setPasswordStrength);
  }, [password]);
  const handleStatusClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setStatus({
      open: false,
      error: false,
      message: "",
    });
  };
  const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData((prevState: registerUserData) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validated = registerFormValidation(
      userData,
      setError,
      passwordStrength
    );
    if (!validated) return;
    const tempData = { ...userData };
    delete tempData.confirmPassword;
    tempData["timestamp"] = serverTimestamp();
    const auth = getAuth();
    const actionCodeSettings = {
      url: "http://localhost:5173/",
      handleCodeInApp: true,
    };
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), tempData);
      await signOut(auth);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      navigate("/register/email-verification");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({ errorCode, errorMessage });
      errorCode === "auth/email-already-in-use"
        ? setStatus({
            open: true,
            error: true,
            message: "Email already in use",
          })
        : setStatus({
            open: true,
            error: true,
            message: "Something went wrong: unable to Register",
          });
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="90vh"
    >
      {status ? (
        <Status status={status} handleClose={handleStatusClose} />
      ) : (
        <></>
      )}
      <Container maxWidth="xs">
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", display: "flex", justifyContent: "center" }}
        >
          Register
        </Typography>
        <form onSubmit={onFormSubmit}>
          <Grid2 container spacing={2} mt={2}>
            <Grid2 xs={6}>
              <TextField
                label="First Name"
                variant="standard"
                name="firstName"
                onChange={onFormChange}
                value={firstName}
                error={firstNameError.error ? true : false}
                helperText={firstNameError.message}
                fullWidth
              />
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                label="Last Name"
                variant="standard"
                name="lastName"
                onChange={onFormChange}
                value={lastName}
                error={lastNameError.error ? true : false}
                helperText={lastNameError.message}
                fullWidth
              />
            </Grid2>
            <Grid2 xs={12}>
              <TextField
                label="Email"
                variant="standard"
                name="email"
                type="email"
                onChange={onFormChange}
                value={email}
                error={emailError.error ? true : false}
                helperText={emailError.message}
                fullWidth
              />
            </Grid2>
            <Grid2 xs={12}>
              <FormControl fullWidth variant="standard">
                <InputLabel
                  htmlFor="password"
                  sx={{ color: passwordError.error && red[600] }}
                >
                  Password
                </InputLabel>
                <ClickAwayListener onClickAway={onPopperClose}>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    name="password"
                    onChange={onFormChange}
                    onClick={onPopperOpen}
                    error={passwordError.error ? true : false}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setPasswordsToggle((prevstate) => ({
                              ...prevstate,
                              showPassword: !showPassword,
                            }))
                          }
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </ClickAwayListener>
                <FormHelperText sx={{ color: red[600] }}>
                  {passwordError.message}
                </FormHelperText>
                {password ? (
                  <>
                    <StyledLinearProgress
                      variant="determinate"
                      value={passwordStrength.progress}
                      progress={passwordStrength.progress}
                    />
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.status}
                    </Typography>
                  </>
                ) : (
                  <></>
                )}

                <Popper
                  sx={{ pl: 5 }}
                  open={Boolean(popperAnchor)}
                  anchorEl={popperAnchor}
                  placement="right"
                  disablePortal={true}
                  modifiers={[
                    {
                      name: "flip",
                      enabled: true,
                      options: {
                        altBoundary: true,
                        rootBoundary: "document",
                        padding: 8,
                      },
                    },
                    {
                      name: "preventOverflow",
                      enabled: true,
                      options: {
                        altAxis: true,
                        altBoundary: true,
                        tether: true,
                        rootBoundary: "document",
                        padding: 8,
                      },
                    },
                  ]}
                >
                  <Box
                    sx={{
                      border: "1px solid silver",
                      borderRadius: 2,
                      p: 1,
                      bgcolor: "background.paper",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      component="p"
                      sx={{ px: 2, fontWeight: "bold" }}
                    >
                      Tips for Password:
                    </Typography>
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{ pt: 1, px: 2 }}
                    >
                      Good password has:
                    </Typography>
                    <ul className="password-tips-list">
                      <li className="password-tips-list">
                        <Typography variant="body1" component="p">
                          Atleast one uppercase letter
                        </Typography>
                      </li>
                      <li className="password-tips-list">
                        <Typography variant="body1" component="p">
                          Atleast one lowercase letter
                        </Typography>
                      </li>
                      <li className="password-tips-list">
                        <Typography variant="body1" component="p">
                          Atleast one number
                        </Typography>
                      </li>
                      <li className="password-tips-list">
                        <Typography variant="body1" component="p">
                          Is 6 or more characters
                        </Typography>
                      </li>
                    </ul>
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{ pt: 1, px: 2 }}
                    >
                      Strong password has:
                    </Typography>
                    <ul className="password-tips-list">
                      <li className="password-tips-list">
                        <Typography variant="body1" component="p">
                          All the requirements of a good password
                        </Typography>
                      </li>
                      <li className="password-tips-list">
                        <Typography variant="body1" component="p">
                          Atleast one symbol
                        </Typography>
                      </li>
                      <li className="password-tips-list">
                        <Typography variant="body1" component="p">
                          Is 8 or more characters
                        </Typography>
                      </li>
                    </ul>
                  </Box>
                </Popper>
              </FormControl>
            </Grid2>
            <Grid2 xs={12}>
              <FormControl fullWidth variant="standard">
                <InputLabel
                  htmlFor="confirmPassword"
                  sx={{ color: confirmPasswordError.error && red[600] }}
                >
                  Confirm Password
                </InputLabel>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  name="confirmPassword"
                  onChange={onFormChange}
                  error={confirmPasswordError.error ? true : false}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setPasswordsToggle((prevstate) => ({
                            ...prevstate,
                            showConfirmPassword: !showConfirmPassword,
                          }))
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText sx={{ color: red[600] }}>
                  {confirmPasswordError.message}
                </FormHelperText>
              </FormControl>
            </Grid2>
          </Grid2>

          <Button
            variant="contained"
            type="submit"
            sx={{ m: "0 auto", display: "flex", mt: 4 }}
          >
            Submit
          </Button>
        </form>
        <Typography
          variant="body1"
          component="p"
          sx={{ display: "flex", justifyContent: "center" }}
          mt={2}
        >
          Already have an account?
          <Link to="/login" className="space">
            {" "}
            Login
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Register;

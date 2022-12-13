import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
import { ChangeEvent, FormEvent, useState } from "react";
import { loginErrors, loginUserData, StatusType } from "../types";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import Status from "../components/Status";
import bcrypt from "bcryptjs";

function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<loginUserData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<loginErrors>({
    emailError: { error: false, message: " " },
    passwordError: { error: false, message: " " },
  });
  const [status, setStatus] = useState<StatusType>({
    open: false,
    error: false,
    message: "",
  });
  const { email, password } = userData;
  const { emailError, passwordError } = error;

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
    setUserData((prevState: loginUserData) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const validation = () => {
    if (!email || !password) {
      !email
        ? setError((prevstate) => ({
            ...prevstate,
            emailError: { error: true, message: "Please fill this out" },
          }))
        : setError((prevstate) => ({
            ...prevstate,
            emailError: { error: false, message: " " },
          }));
      !password
        ? setError((prevstate) => ({
            ...prevstate,
            passwordError: { error: true, message: "Please fill this out" },
          }))
        : setError((prevstate) => ({
            ...prevstate,
            passwordError: { error: false, message: " " },
          }));
      return false;
    }
    return true;
  };
  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validated = validation();
    if (!validated) return;
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      //user is signed in
      const user = userCredential.user;
      if (user) {
        navigate("/");
      }
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      setStatus({
        open: true,
        error: true,
        message: "Invalid credentials",
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
          Login
        </Typography>
        <form onSubmit={onFormSubmit}>
          <Grid2 container spacing={2} mt={2}>
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
                  htmlFor="standard-adornment-password"
                  sx={{ color: passwordError.error && red[600] }}
                >
                  Password
                </InputLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  name="password"
                  onChange={onFormChange}
                  error={passwordError.error ? true : false}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowPassword((prevstate) => !prevstate)
                        }
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText sx={{ color: red[600] }}>
                  {passwordError.message}
                </FormHelperText>
              </FormControl>
              <Typography
                variant="body2"
                component="p"
                sx={{ textAlign: "right" }}
              >
                <Link to="/forgot-password">Forgot password?</Link>
              </Typography>
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
        <Box component="span" sx={{ display: "block", m: "25px" }}>
          <Typography
            variant="body1"
            component="p"
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              borderBottom: "1px solid black",
              position: "relative",
            }}
            mt={2}
          >
            <Box
              component="span"
              sx={{
                position: "relative",
                top: "10px",
                padding: "0 10px",
                backgroundColor: "#FFFF",
              }}
            >
              Or Login with
            </Box>
          </Typography>
        </Box>
        <OAuth />
        <Typography
          variant="body1"
          component="p"
          sx={{ display: "flex", justifyContent: "center" }}
          mt={2}
        >
          Don't have an account?
          <Link to="/register" className="space">
            {" "}
            Register
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;

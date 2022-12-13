import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import Container from "@mui/system/Container";
import TextField from "@mui/material/TextField";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ChangeEvent, FormEvent, useState } from "react";
import { StatusType, ForgotPasswordEmailError } from "../types";
import Status from "../components/Status";

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<ForgotPasswordEmailError>({
    error: false,
    message: "",
  });
  const [status, setStatus] = useState<StatusType>({
    open: false,
    error: false,
    message: "",
  });

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

  const validation = () => {
    const emailRegEx = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (!email || !emailRegEx.test(email)) {
      setEmailError({ error: true, message: "Please fill this out" });
      return false;
    } else {
      setEmailError({ error: false, message: " " });
    }
    return true;
  };

  const onPasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("hello");
    const validated = validation();
    console.log(emailError);
    if (!validated) return;
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus({ open: true, error: false, message: "Link sent!" });
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="90vh"
    >
      <Status status={status} handleClose={handleStatusClose} />
      <Container maxWidth="sm">
        <Typography
          variant="h3"
          component="h2"
          sx={{ fontWeight: "bold", py: 2 }}
        >
          Password Reset
        </Typography>
        <Typography variant="body1" component="p">
          Enter your email the button below to confirm your password reset. A
          link will be sent to your email with instructions on reseting your
          password.
        </Typography>
        <form onSubmit={onPasswordReset}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={10}
          >
            <TextField
              label="Email"
              variant="standard"
              name="email"
              type="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              value={email}
              error={emailError.error ? true : false}
              helperText={emailError.message}
              fullWidth
            />
            <Button type="submit" variant="contained" size="small">
              Reset
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
}

export default ForgotPassword;

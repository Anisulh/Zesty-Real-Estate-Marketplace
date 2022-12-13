import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { StatusProps } from "../types";

function Status(props: StatusProps) {
  return (
    <>
      {props.status.error ? (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={props.status.open}
          autoHideDuration={6000}
          onClose={props.handleClose}
        >
          <Alert
            onClose={props.handleClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {props.status.message}
          </Alert>
        </Snackbar>
      ) : (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={props.status.open}
          autoHideDuration={6000}
          onClose={props.handleClose}
          message={props.status.message}
        />
      )}
    </>
  );
}

export default Status;

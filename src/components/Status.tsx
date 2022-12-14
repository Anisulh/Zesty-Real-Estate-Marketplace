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
          onClose={(e) => props.handleClose(e, props.setStatus)}
        >
          <Alert
            onClose={(e) => props.handleClose(e, props.setStatus)}
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
          onClose={(e) => props.handleClose(e, props.setStatus)}
          message={props.status.message}
        />
      )}
    </>
  );
}

export default Status;

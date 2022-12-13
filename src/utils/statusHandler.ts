import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { StatusType } from "../types";

export const handleStatusClose = (
  event: SyntheticEvent | Event,
  setStatus:Dispatch<SetStateAction<StatusType>>,
  reason?: string,
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
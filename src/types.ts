import { LinearProgressProps } from "@mui/material";
import { DocumentData, FieldValue } from "firebase/firestore";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";


export interface registerUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  timestamp?: FieldValue
}

export interface loginUserData{
  email: string;
  password: string;
}
export interface registerErrors {
  firstNameError: { error: Boolean; message: String };
  lastNameError: { error: Boolean; message: String };
  emailError: { error: Boolean; message: String };
  passwordError: { error: Boolean; message: String };
  confirmPasswordError: { error: Boolean; message: String };
}

export interface loginErrors {
  emailError: { error: Boolean; message: String };
  passwordError: { error: Boolean; message: String };
}

export interface StatusProps{
  status: StatusType;
  setStatus:Dispatch<SetStateAction<StatusType>>;
  handleClose: (
    event: SyntheticEvent | Event,
    setStatus: Dispatch<SetStateAction<StatusType>>,
    reason?: string
  ) => void;
}

export interface StatusType {
  open: boolean;
  error: boolean;
  message: string;
}

export interface ForgotPasswordEmailError {
  error: boolean;
  message: string;
}

export interface passwordStrength {
  progress: number;
  status: string;
  color: string;
}

export interface StyledLinearProgressProps extends LinearProgressProps {
  progress?: number;
}

export interface SelectedLocationType{
  lat: number,
  lng: number
}

export interface SearchBarProps{
  setSelected: Dispatch<SetStateAction<SelectedLocationType>>
}
export interface MapProps{
  selected: SelectedLocationType
}

export interface ListingDataType {
  type: "rent" | "sell";
  homeType:
    | "singleFamily"
    | "multiFamily"
    | "condo"
    | "townhouse"
    | "coop"
    | "apartment"
    | "other";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: number;
  yearBuilt: number;
  lastStructuralRemodel: number;
  parking: boolean;
  furnished: boolean;
  address: string;
  description: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice?: number;
  images?: FileList | null;
  geoCode: {
    lat: number,
    lng: number
  }
  userRef?: string;
}
export interface ListingType {
  id: string;
  data: DocumentData;
}

export interface ListingProps {
  listing: ListingType
}
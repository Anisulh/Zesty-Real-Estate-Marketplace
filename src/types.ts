import { LinearProgressProps } from "@mui/material";
import { DocumentData, FieldValue } from "firebase/firestore";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export interface registerUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  timestamp?: FieldValue;
}

export interface loginUserData {
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

export interface StatusProps {
  status: StatusType;
  setStatus: Dispatch<SetStateAction<StatusType>>;
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

export interface SelectedLocationType {
  lat: number;
  lng: number;
}

export interface ISearchQueries {
  type: string | "sale" | "rent";
  homeType:
    | "singleFamily"
    | "multiFamily"
    | "condo"
    | "townhouse"
    | "coop"
    | "apartment"
    | "other";
  bedrooms: number | null;
  bathrooms: number | null;
}

export interface SearchBarProps {
  setSelected: Dispatch<SetStateAction<SelectedLocationType>>;
  searchQueries: ISearchQueries;
  setSearchQueries: Dispatch<SetStateAction<ISearchQueries>>;
}
export interface MapProps {
  selected: SelectedLocationType;
}

export interface ListingDataType {
  type: "rent" | "sale";
  homeType:
    | "singleFamily"
    | "multiFamily"
    | "condo"
    | "townhouse"
    | "coop"
    | "apartment"
    | "other";
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  lastStructuralRemodel: number | null;
  parking: boolean;
  furnished: boolean;
  address: string | null;
  unitNumber?: string | null;
  description: string | null;
  offer: boolean;
  regularPrice: number | null;
  discountedPrice?: number | null;
  images?: Blob[] | null;
  geoCode: {
    lat: number;
    lng: number;
  };
  userRef?: string;
}
export interface ListingType {
  id: string;
  data: DocumentData;
}

export interface ListingProps {
  listing: ListingType;
}

export interface CreateListingFormProps {
  listingData: ListingDataType;
  setListingData?: Dispatch<SetStateAction<ListingDataType>>;
  onFormChange: (e: any) => void;
  setStepComplete: Dispatch<SetStateAction<boolean>>;
  isLoaded?: boolean;
  imageUrls?: any;
  setImageUrls?: Dispatch<SetStateAction<string[]>>;
}

export type Libraries = "places"[];

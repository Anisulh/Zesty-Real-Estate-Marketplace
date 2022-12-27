import { Dispatch, SetStateAction } from "react";
import {
  passwordStrength,
  registerErrors,
  registerUserData,
  StatusType,
} from "../types";

export const registerFormValidation = (
  userData: registerUserData,
  setError: Dispatch<SetStateAction<registerErrors>>,
  passwordStrength: passwordStrength
) => {
  const { firstName, lastName, email, password, confirmPassword } = userData;

  const emailRegEx = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    !firstName
      ? setError((prevstate) => ({
          ...prevstate,
          firstNameError: { error: true, message: "Please fill this out" },
        }))
      : setError((prevstate) => ({
          ...prevstate,
          firstNameError: { error: false, message: " " },
        }));
    !lastName
      ? setError((prevstate) => ({
          ...prevstate,
          lastNameError: { error: true, message: "Please fill this out" },
        }))
      : setError((prevstate) => ({
          ...prevstate,
          lastNameError: { error: false, message: " " },
        }));
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
    !confirmPassword
      ? setError((prevstate) => ({
          ...prevstate,
          confirmPasswordError: {
            error: true,
            message: "Please fill this out",
          },
        }))
      : setError((prevstate) => ({
          ...prevstate,
          confirmPasswordError: {
            error: false,
            message: " ",
          },
        }));
    return false;
  }
  if (password !== confirmPassword) {
    setError((prevstate) => ({
      ...prevstate,
      confirmPasswordError: {
        error: true,
        message: "Passwords do not match",
      },
    }));
    return false;
  } else {
    setError((prevstate) => ({
      ...prevstate,
      confirmPasswordError: {
        error: false,
        message: " ",
      },
    }));
  }

  if (passwordStrength.progress < 60) {
    setError((prevstate) => ({
      ...prevstate,
      passwordError: {
        error: true,
        message: "Please enter a stronger password",
      },
    }));
    return false;
  } else {
    setError((prevstate) => ({
      ...prevstate,
      passwordError: {
        error: false,
        message: " ",
      },
    }));
  }
  if (!emailRegEx.test(email)) {
    setError((prevstate) => ({
      ...prevstate,
      emailError: { error: true, message: "Email is not properly formatted" },
    }));
    return false;
  } else {
    setError((prevstate) => ({
      ...prevstate,
      emailError: { error: false, message: " " },
    }));
  }
  return true;
};

export const passwordStrengthValidation = (
  password: string,
  setPasswordStrength: Dispatch<SetStateAction<passwordStrength>>
) => {
  // at least one lowercase, one uppercase, one digit, one special, and is at least eight characters
  const strongPassword = new RegExp(
    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
  );
  // at least six characters long and meets all the other requirements, but no symbol
  const moderatePassword = new RegExp(
    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,}).{6,}$/
  );
  // is between 3 and 6 characters
  const weakPassword = new RegExp(/^.{3,}$/);
  if (strongPassword.test(password)) {
    setPasswordStrength({
      progress: 100,
      status: "Strong Password",
      color: "Green",
    });
  } else if (moderatePassword.test(password)) {
    setPasswordStrength({
      progress: 80,
      status: "Moderate Password",
      color: "Blue",
    });
  } else if (weakPassword.test(password)) {
    setPasswordStrength({
      progress: 50,
      status: "Weak Password: please include the elements listed in guideline",
      color: "Orange",
    });
  } else {
    setPasswordStrength({
      progress: 30,
      status:
        "Invalid Password: please include the elements listed in guideline",
      color: "Red",
    });
  }
};

export const createListingValidation = (
  discountedPrice: number | undefined | null,
  regularPrice: number | null,
  images: Blob[] | null | undefined,
  lat: number,
  lng: number,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setStatus: Dispatch<SetStateAction<StatusType>>
) => {
  if (!regularPrice) {
    setLoading(false);
    setStatus({
      open: true,
      error: true,
      message: "Please enter a price",
    });
    return false;
  }
  if (discountedPrice && regularPrice && discountedPrice >= regularPrice) {
    setLoading(false);
    setStatus({
      open: true,
      error: true,
      message: "Offer price is higher or equal to regular price",
    });
    return false;
  }
  if (images?.length && images?.length > 6) {
    setLoading(false);
    setStatus({
      open: true,
      error: true,
      message: "There can only a max of 6 images",
    });
    return false;
  }
  if (lat === 0 || lng === 0) {
    setLoading(false);
    setStatus({
      open: true,
      error: true,
      message: "Address not entered, try again",
    });
    return false;
  }
  return true;
};

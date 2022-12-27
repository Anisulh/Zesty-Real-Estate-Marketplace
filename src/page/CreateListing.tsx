import Button from "@mui/material/Button";
import Container from "@mui/system/Container";
import Stack from "@mui/system/Stack";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Status from "../components/Status";
import { Libraries, ListingDataType, StatusType } from "../types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { handleStatusClose } from "../utils/statusHandler";
import Typography from "@mui/material/Typography";
import { useLoadScript } from "@react-google-maps/api";
import IntroForm from "../components/Intro-CreateListing";
import SpecificationForm from "../components/Specification-CreateListing";
import DescriptionForm from "../components/Description-CreateListing";
import { createListingValidation } from "../utils/formValidation";
import Box from "@mui/system/Box";
import { StepIconProps } from "@mui/material/StepIcon";
import Check from "@mui/icons-material/Check";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { QontoConnector, QontoStepIconRoot } from "../styles";
import { storeImage } from "../utils/UploadImageHandler";

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}
const steps = ["Introduction", "Specification", "Description"];
function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [libraries] = useState<Libraries>(["places"]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: libraries,
  });
  const isMounted = useRef(true);
  const [status, setStatus] = useState<StatusType>({
    open: false,
    error: false,
    message: "",
  });
  const [step, setStep] = useState<number>(0);
  const [stepComplete, setStepComplete] = useState<boolean>(false);
  const currentFormStep = () => {
    switch (step) {
      case 0:
        return (
          <IntroForm
            listingData={listingData}
            onFormChange={onFormChange}
            setStepComplete={setStepComplete}
            setListingData={setListingData}
          />
        );
      case 1:
        return (
          <SpecificationForm
            listingData={listingData}
            setListingData={setListingData}
            onFormChange={onFormChange}
            setStepComplete={setStepComplete}
          />
        );
      case 2:
        return (
          <DescriptionForm
            listingData={listingData}
            imageUrls={imageUrls}
            setImageUrls={setImageUrls}
            onFormChange={onFormChange}
            setStepComplete={setStepComplete}
          />
        );

      default:
        return (
          <IntroForm
            listingData={listingData}
            onFormChange={onFormChange}
            setStepComplete={setStepComplete}
            setListingData={setListingData}
          />
        );
    }
  };

  const [listingData, setListingData] = useState<ListingDataType>({
    type: "sell",
    homeType: "singleFamily",
    bedrooms: null,
    bathrooms: null,
    sqft: null,
    lotSize: null,
    yearBuilt: null,
    lastStructuralRemodel: null,
    parking: false,
    furnished: false,
    address: null,
    unitNumber: null,
    description: null,
    offer: false,
    regularPrice: null,
    discountedPrice: null,
    images: null,
    geoCode: {
      lat: 0,
      lng: 0,
    },
  });
  const { regularPrice, discountedPrice, images, geoCode, unitNumber } =
    listingData;
  const { lat, lng } = geoCode;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setListingData({ ...listingData, userRef: user.uid });
        } else {
          navigate("/login");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, navigate]);

  useEffect(() => {
    if (images) {
      let newArr = [];
      for (let i = 0; i < images.length; i++) {
        newArr.push(URL.createObjectURL(images[i]));
      }
      setImageUrls(newArr);
    }
  }, [images]);

  const [loading, setLoading] = useState(false);

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const validated = createListingValidation(
      discountedPrice,
      regularPrice,
      images,
      lat,
      lng,
      setLoading,
      setStatus
    );
    if (validated && images) {
      const imgUrls = await Promise.all(
        [...images].map((image) => storeImage(auth, image))
      ).catch(() => {
        setLoading(false);
        setStatus({
          open: true,
          error: true,
          message: "Images not uploaded",
        });
        return;
      });
      const tempListingData = {
        ...listingData,
        imgUrls,
        timestamp: serverTimestamp(),
      };

      delete tempListingData.images;
      !tempListingData.offer && delete tempListingData.discountedPrice;
      !tempListingData.unitNumber && delete tempListingData.unitNumber;
      const docRef = await addDoc(collection(db, "listings"), tempListingData);
      setLoading(false);
      navigate(`/listing/${docRef.id}`);
    } else {
      setLoading(false);
      setStatus({
        open: true,
        error: true,
        message: "Unable to upload listings",
      });
      return;
    }
  };

  const onFormChange = (e: any) => {
    let boolean: boolean | null = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setListingData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setListingData((prevState) => ({
        ...prevState,
        [e.target.name]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading || !isLoaded) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="xl">
      {status && (
        <Status
          status={status}
          setStatus={setStatus}
          handleClose={handleStatusClose}
        />
      )}
      <Box>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", ml: 3 }}
        >
          Create Listing
        </Typography>
        <Stepper
          alternativeLabel
          activeStep={step}
          connector={<QontoConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <form onSubmit={onFormSubmit}>
        {currentFormStep()}
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          sx={{ my: 10 }}
        >
          {step > 0 && step < 3 && (
            <Button
              type="button"
              variant="contained"
              onClick={() => {
                console.log(step);
                setStep((prevStep) => prevStep - 1);
              }}
            >
              Back
            </Button>
          )}
          {step !== 2 ? (
            <Button
              type="button"
              variant="contained"
              onClick={() => {
                if (stepComplete) {
                  setStep((prevStep) => prevStep + 1);
                  setStepComplete(false);
                }
              }}
              disabled={!stepComplete}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained" disabled={loading}>
              Submit
            </Button>
          )}
        </Stack>
      </form>
    </Container>
  );
}

export default CreateListing;

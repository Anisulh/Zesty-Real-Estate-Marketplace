import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import Container from "@mui/system/Container";
import Stack from "@mui/system/Stack";
import ClearIcon from "@mui/icons-material/Clear";
import { CreateListingFormProps } from "../types";
import { useEffect } from "react";

function DescriptionForm(props: CreateListingFormProps) {
  const {
    listingData,
    onFormChange,
    imageUrls,
    setImageUrls,
    setStepComplete,
  } = props;
  const { description } = listingData;

  useEffect(() => {
    if (description && imageUrls?.length > 0) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  }, [description, imageUrls]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" component="h3" sx={{ fontWeight: "bold" }}>
        Tell us more...
      </Typography>
      <Stack direction="column" gap={1} sx={{ mx: { xl: 40, lg: 25, md: 15 } }}>
        <Typography variant="h6" component="h3">
          Description:
        </Typography>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <TextField
            className="input"
            sx={{ width: "400px", margin: "5px", marginBottom: "30px" }}
            multiline
            label="Description"
            name="description"
            onChange={onFormChange}
            value={description}
            required
          />
        </Stack>

        <Box mb={5}>
          <Typography variant="h6" component="h3">
            Images:
          </Typography>
          <Typography variant="body1" component="p">
            The first image will be the cover (max 6).
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            <Button variant="contained" component="label">
              Upload
              <input
                hidden
                type="file"
                name="images"
                onChange={onFormChange}
                max={6}
                accept=".jpg,.png,.jpeg"
                multiple
              />
            </Button>
          </Box>

          <Box>
            {imageUrls && (
              <ImageList
                sx={{ width: 500, height: 300 }}
                cols={3}
                rowHeight={164}
              >
                {imageUrls.map((item: string) => (
                  <ImageListItem key={item} sx={{ position: "relative" }}>
                    <IconButton
                      onClick={() => {
                        const index = imageUrls.findIndex(
                          (image: string) => image === item
                        );
                        if (index > -1 && setImageUrls) {
                          setImageUrls((prevState) =>
                            [...prevState].filter((image) => image !== item)
                          );
                        }
                      }}
                      size="small"
                      sx={{
                        position: "absolute",
                        right: 0,
                        backgroundColor: "gray",
                        p: 0,
                      }}
                    >
                      <ClearIcon sx={{ color: "white" }} />
                    </IconButton>
                    <img src={item} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}

export default DescriptionForm;

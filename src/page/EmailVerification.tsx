import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import Container from "@mui/system/Container";

function EmailVerification() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="90vh"
    >
      <Container maxWidth="xs">
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", py: 2 }}
        >
          Email Sent
        </Typography>
        <Typography variant="body1" component="p">
          Check your email for a sign in link. Click that link to complete
          registeration
        </Typography>
      </Container>
    </Box>
  );
}

export default EmailVerification;

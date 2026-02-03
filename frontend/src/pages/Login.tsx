import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Content from "../components/Content";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
// import Grid from '@mui/material/Grid2';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { Link, OutlinedInput } from "@mui/material";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  // handlesubmit function for the form element
  // handleclick function for the submit element
  return (
    <Grid container sx={{ minHeight: "100dvh", minWidth: "100%" }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            bgcolor: "white",
          }}
        >
          {/* // card contains sign-in features */}
          <Card variant="string" sx={{ width: "clamp(320px, 90vw, 420px)" }}>
            {/* // typology component for "sign in" */}
            <Typography fontWeight={700} fontSize={32}>
              Sign up
            </Typography>
            {/* // box for sign in options */}
            <Stack
              sx={{ xs: "100%", sm: 360 }}
              direction="column"
              spacing={2}
              mt={2}
              mb={2}
            >
              {/* // button for google */}
              <Button
                sx={{
                  color: "rgb(32 32 32)",
                  textTransform: "none",
                  fontWeight: "700",
                  fontSize: "18px",
                  width: "100%",
                }}
                variant="outlined"
              >
                Continue with Google
              </Button>
              {/* // button for facebook */}
              <Button
                sx={{
                  color: "rgb(32 32 32)",
                  textTransform: "none",
                  fontWeight: "700",
                  fontSize: "18px",
                  width: "100%",
                }}
                variant="outlined"
              >
                Continue with Facebook
              </Button>
              {/* // button for apple */}
              <Button
                sx={{
                  color: "rgb(32 32 32)",
                  textTransform: "none",
                  fontWeight: "700",
                  fontSize: "18px",
                  width: "100%",
                }}
                variant="outlined"
              >
                Continue with Apple
              </Button>
            </Stack>
            {/* // divider */}
            <Divider />
            {/* // box for login forms (label form) */}
            <Stack spacing={2}>
              {/* // formcontrol, label: email, textfield */}
              <FormControl>
                <TextField
                  variant="outlined"
                  label="Email"
                  placeholder="Enter your personal or your work email..."
                  sx={{
                    "& .MuiFilledInput-input": {
                      backgroundColor: "#ffffff",
                    },
                  }}
                />
              </FormControl>
              {/* // formcontrol for password */}
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      backgroundColor: "#ffffff",
                    },
                  }}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              {/* // button "sign up with email" (label submit) */}
              <Button
                sx={{
                  textTransform: "none",
                  fontWeight: "700",
                  fontSize: "18px",
                  color: "white",
                }}
                variant="contained"
                color="primary"
              >
                Sign up with Email
              </Button>
              {/* // typography terms and conditions */}
              <Typography sx={{ fontWeight: "400", fontSize: "13px" }}>
                By continuing with Google, Apple, or Email, you agree to
                TodoList’s Terms of Service and Privacy Policy.
              </Typography>
              <Divider />
              {/* // typography, link to login */}
              <Typography
                sx={{ fontWeight: "400", fontSize: "13px" }}
                align="center"
              >
                Already signed up?
                <Link> Go to login</Link>
              </Typography>
            </Stack>
          </Card>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Content />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;

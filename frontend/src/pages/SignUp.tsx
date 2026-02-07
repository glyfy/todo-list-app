import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Content from "../components/Content";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { FormHelperText, Link, OutlinedInput } from "@mui/material";

const SignUp = () => {
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailTouched, setEmailTouched] = React.useState(false);
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
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    // send http to backend
    // if success, log user into next page
  };
  // handleclick function for the submit element
  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailTouched(false);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }
    return isValid;
  };
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
            <Stack spacing={2} component="form" onSubmit={handleSubmit}>
              {/* // formcontrol, label: email, textfield */}
              <FormControl>
                <TextField
                  variant="outlined"
                  label="Email"
                  id="email"
                  onFocus={() => {
                    setEmailError(false);
                  }}
                  placeholder="Enter your personal or your work email..."
                  sx={{
                    "& .MuiFilledInput-input": {
                      backgroundColor: "#ffffff",
                    },
                  }}
                />
                <FormHelperText error={emailError}>
                  {emailError && !emailTouched
                    ? "Please enter a valid email"
                    : ""}
                </FormHelperText>
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
                  onFocus={() => {
                    setPasswordError(false);
                  }}
                  id="password"
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
                <FormHelperText error={passwordError}>
                  {passwordError ? "Please enter a valid password" : ""}
                </FormHelperText>
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
                type="submit"
                onClick={validateInputs}
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
                <Link href="/"> Go to login</Link>
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

export default SignUp;

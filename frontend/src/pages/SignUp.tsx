import React from "react";
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
import { api } from "../lib/api";
import { ApiError } from "../types/api";
import { useSnackbar } from "../../SnackbarProvider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { User } from "../types/user";

const SignUp = () => {
  type RegisterResponse = {
    user: {
      id: string;
      email: string;
      name: string;
      created_at: string;
    };
  };

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { setUser } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  const validateInputs = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError(true);
      isValid = false;
    } else {
      setNameError(false);
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailTouched(false);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 8) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { user } = await api<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      setUser({ id: user.id, email: user.email, name: user.name } as User);
      showSnackbar("Account created.", "success");
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          showSnackbar(error.message, "error");
        } else if (error.status === 409) {
          setEmailError(true);
          showSnackbar("That email is already registered.", "error");
        } else if (error.status >= 500) {
          showSnackbar("Server error. Please try again.", "error");
        }
      } else {
        console.error(error);
        showSnackbar("Unexpected error occurred. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
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
              <FormControl>
                <TextField
                  variant="outlined"
                  label="Name"
                  id="name"
                  value={name}
                  onFocus={() => {
                    setNameError(false);
                  }}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder="Enter your name..."
                  sx={{
                    "& .MuiFilledInput-input": {
                      backgroundColor: "#ffffff",
                    },
                  }}
                />
                <FormHelperText error={nameError}>
                  {nameError ? "Please enter your name" : ""}
                </FormHelperText>
              </FormControl>
              {/* // formcontrol, label: email, textfield */}
              <FormControl>
                <TextField
                  variant="outlined"
                  label="Email"
                  id="email"
                  value={email}
                  onFocus={() => {
                    setEmailError(false);
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value);
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
                  value={password}
                  onFocus={() => {
                    setPasswordError(false);
                  }}
                  id="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
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
                  {passwordError
                    ? "Password must be at least 8 characters"
                    : ""}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Sign up with Email"}
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

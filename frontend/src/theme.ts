import { createTheme } from "@mui/material";
import { grey, red } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: red,
    secondary: grey,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

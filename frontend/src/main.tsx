import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { AuthProvider } from "../AuthContext";
import { SnackbarProvider } from "../SnackbarProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SnackbarProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>,
);

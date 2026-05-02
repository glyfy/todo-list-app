import React from "react";
import Box from "@mui/material/Box";

const Content = () => {
  return (
    <Box
      component="img"
      src="/letsdoit_graphic"
      alt="Let's do it graphic"
      sx={{
        display: "block",
        width: "100%",
        maxWidth: 520,
        height: "auto",
        objectFit: "contain",
      }}
    />
  );
};

export default Content;

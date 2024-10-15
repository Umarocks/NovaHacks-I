import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: "flex", paddingLeft: "1rem" }}>
      <CircularProgress size={20} />
    </Box>
  );
}

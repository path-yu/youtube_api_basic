// components/SnackbarComponent.tsx
"use client";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSnackbarStore } from "@/app/store/snackbarStore";

export default function SnackbarComponent() {
  const { open, message, severity, setSnackbar } = useSnackbarStore();

  const handleClose = () => {
    setSnackbar(false); // 关闭 Snackbar
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

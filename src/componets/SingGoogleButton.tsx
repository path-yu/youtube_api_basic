"use client";

import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";

export default function SingGoogleButton() {
  const [btnLoading, setBtnLoading] = useState(false);
  const handleSignClick = () => {
    setBtnLoading(true);
    fetch("/api/getAuthUrl", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setBtnLoading(false);
        window.location.href = data.url;
      });
  };
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleSignClick}
      disabled={btnLoading}
      startIcon={btnLoading ? <CircularProgress size={20} /> : null}
    >
      使用 Google 登录
    </Button>
  );
}

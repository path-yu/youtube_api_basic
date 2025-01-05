"use client";

import { Button } from "@nextui-org/button";
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
    <Button isLoading={btnLoading} color="primary" onPress={handleSignClick}>
      使用 Google 登录
    </Button>
  );
}

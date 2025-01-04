"use client";

import { Button } from "@nextui-org/button";
import { useState } from "react";

export default function Home() {
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
    <div className="flex w-[100vw] h-[100vh] justify-center items-center">
      <Button isLoading={btnLoading} color="primary" onPress={handleSignClick}>
        使用 Google 登录
      </Button>
    </div>
  );
}

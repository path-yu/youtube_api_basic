"use client";

import { Credentials } from "@/app/types/api";
import { useEffect } from "react";

export default function ServerAction({
  action,
  tokens,
}: {
  action: () => void;
  tokens: Credentials;
}) {
  useEffect(() => {
    action();
    // 使用 localStorage 设置token
    localStorage.setItem("access_token", tokens.access_token!);
    localStorage.setItem("refresh_token", tokens.refresh_token!);
    localStorage.setItem("expires_in", tokens.expiry_date + "");
    localStorage.setItem("scope", tokens.scope!);
    localStorage.setItem("token_type", tokens.token_type!);
  }, []);

  return <></>;
}

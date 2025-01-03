import { oauth2Client } from "@/ultis/oauthClient";
import { headers } from "next/headers";
import Link from "next/link";
import React from "react";
import { setCookie } from "@/action/action";

export default async function Oauth2CallbackPage() {
  const headersList = await headers();
  const url = new URL(headersList.get("x-current-path") as string);
  const code = url.searchParams.get("code");
  if (!code) {
    return renderError("No Code Provided");
  }
  // sing code
  try {
    const { tokens } = await oauth2Client.getToken(code!);
    setCookie(tokens);
    return renderSuccess("授权成功", code);
  } catch (error) {
    return renderError("授权失败");
  }
}

function renderError(message: string) {
  return (
    <div className="flex justify-center flex-col w-full items-center h-screen">
      <div className="text-red-600">{message}</div>
      <Link href="/" className="text-blue-300 text-base">
        点击返回
      </Link>
    </div>
  );
}

function renderSuccess(message: string, code: string) {
  return (
    <div className="flex justify-center flex-col w-full items-center h-screen">
      <div className="text-green-300">{message}</div>
      <Link href="/home" className="text-blue-300 text-base">
        点击进入首页
      </Link>
    </div>
  );
}

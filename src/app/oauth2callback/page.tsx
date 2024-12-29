import { oauth2Client } from "@/ultis/oauthClient";
import { headers } from "next/headers";
import React from "react";

export default async function Oauth2CallbackPage() {
  const headersList = await headers();
  const url = new URL(headersList.get("x-current-path") as string);
  const code = url.searchParams.get("code");
  if (!code) {
    return renderError("No Code Provided");
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log(tokens);

    return renderSuccess("授权成功", code);
  } catch (error) {
    return renderError("授权失败");
  }
}

function renderError(message: string) {
  return (
    <div className="flex justify-center flex-col w-full items-center h-screen">
      <div className="text-red-600">{message}</div>
      <a href="/" className="text-blue-300 text-base">
        点击返回
      </a>
    </div>
  );
}

function renderSuccess(message: string, code: string) {
  return (
    <div className="flex justify-center flex-col w-full items-center h-screen">
      <div className="text-green-300">{message}</div>
      <a href={"/home?code=" + code} className="text-blue-300 text-base">
        点击返回首页
      </a>
    </div>
  );
}

import { headers } from "next/headers";
import React from "react";

export default async function Oauth2CallbackPage() {
  const headersList = await headers();
  const url = new URL(headersList.get("x-current-path") as string);
  const code = url.searchParams.get("code");
  if (!code) {
    return renderError("No Code Provided");
  }
  return renderSuccess("授权成功", code);
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
        点击进入首页
      </a>
    </div>
  );
}

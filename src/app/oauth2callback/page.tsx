"use server";
import ServerAction from "@/componets/ServerAction";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import React from "react";
import { Credentials } from "../types/api";
import { oauth2Client } from "@/ultis/oauthClient";
let currentPagePath: string;
export default async function Oauth2CallbackPage() {
  async function setCookieAction(tokens: Credentials) {
    "use server";
    const cookieStore = await cookies();
    cookieStore.set("access_token", tokens.access_token!);
    cookieStore.set("refresh_token", tokens.refresh_token!);
    cookieStore.set("scope", tokens.scope!);
    cookieStore.set("token_type", tokens.token_type!);
    cookieStore.set("expiry_date", tokens.expiry_date!.toString());
  }
  const headersList = await headers();
  let currentPath = headersList.get("x-current-path") as string;
  // 缓存因为服务端组件注入了客户端组件 导致触发二次render 第二次无法获取headers path
  if (currentPath) {
    currentPagePath = currentPath;
  }
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");

  const url = new URL(currentPagePath);
  const code = url.searchParams.get("code");
  if (!code) {
    return renderError("No Code Provided");
  }
  try {
    if (access_token) {
      return renderSuccess("授权成功");
    } else {
      const { tokens } = await oauth2Client.getToken(code!);
      const bindServerAction = setCookieAction.bind(
        null,
        tokens as Credentials
      );
      return (
        <>
          {renderSuccess("授权成功")}
          <ServerAction action={bindServerAction}></ServerAction>
        </>
      );
    }
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

function renderSuccess(message: string) {
  return (
    <div className="flex justify-center flex-col w-full items-center h-screen">
      <div className="text-green-300">{message}</div>
      <Link href="/home" className="text-blue-300 text-base">
        点击进入首页
      </Link>
    </div>
  );
}

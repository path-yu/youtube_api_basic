"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Credentials } from "../types/api";
import { updateStoredTokens } from "@/utils/fetchGoogleApi";

// 定义基础 URL 和环境变量
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET; // 注意安全性，仅用于演示
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

// 封装获取令牌的函数
async function fetchOAuthToken(code: string): Promise<Credentials> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID || "",
      client_secret: CLIENT_SECRET || "",
      redirect_uri: REDIRECT_URI || "",
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tokens");
  }

  const tokens = await response.json();
  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    scope: tokens.scope,
    token_type: tokens.token_type,
    expires_in: Date.now() + (tokens.expires_in || 3600) * 1000, // 默认 1 小时
  };
}

export default function Oauth2CallbackPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function handleOAuthCallback() {
      // 从 URL 获取 code 参数
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (!code) {
        setMessage("No Code Provided");
        setIsSuccess(false);
        return;
      }

      // 检查 localStorage 是否已有 access_token
      const existingAccessToken = localStorage.getItem("access_token");
      if (existingAccessToken) {
        setMessage("授权成功");
        setIsSuccess(true);
        return;
      }

      try {
        // 使用封装的工具函数获取令牌
        const tokens = await fetchOAuthToken(code);
        // 保存令牌到 localStorage
        updateStoredTokens(tokens);

        setMessage("授权成功");
        setIsSuccess(true);
      } catch (error) {
        setMessage("授权失败");
        setIsSuccess(false);
      }
    }

    handleOAuthCallback();
  }, []); // 空依赖数组，仅在组件挂载时运行

  if (message === null) {
    return <div>Loading...</div>; // 初始加载状态
  }

  return isSuccess ? renderSuccess(message) : renderError(message);
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

// pages/index.tsx
"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/componets/home/SearchBar";
import VideoList from "@/componets/home/VideoList";
import { validateToken } from "@/utils/fetchGoogleApi";
import useAppStore from "../store";

export default function HomePage() {
  const [isValid, setIsValid] = useState<boolean | null>(null); // null 表示未校验
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { initState } = useAppStore();

  useEffect(() => {
    initState();
    async function checkToken() {
      const isDev = process.env.NODE_ENV === "development";

      // // 在开发环境下，跳过校验，直接视为有效
      if (isDev) {
        setIsValid(true);
        return;
      }

      // 调用 validateToken 校验令牌
      const result = await validateToken();
      setIsValid(result.isValid);
      if (!result.isValid) {
        setErrorMessage(result.message);
      }
    }

    checkToken();
  }, []);
  // 校验中，显示加载状态
  if (isValid === null) {
    return (
      <div className="flex justify-center items-center flex-col h-[100vh]">
        <span className="text-gray-500">正在校验令牌...</span>
      </div>
    );
  }

  // 令牌有效，显示主内容
  if (isValid) {
    return (
      <>
        <SearchBar />
        <div className="h-[calc(100vh-92px)] overflow-y-scroll mt-4">
          <VideoList />
        </div>
      </>
    );
  }

  // 令牌无效，显示错误信息
  return (
    <div className="flex justify-center items-center flex-col h-[100vh]">
      <span className="text-red-500">{errorMessage || "请先登录"}</span>
      <a href="/" className="text-base">
        返回首页
      </a>
    </div>
  );
}

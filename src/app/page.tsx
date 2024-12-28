"use client";

import { useEffect } from "react";

export default async function Home() {
  console.log(process.env.NODE_ENV);

  const handleSignClick = () => {
    fetch("/api/getAuthUrl", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = data.url;
      });
  };
  useEffect(() => {
    // 获取url参数code
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
      fetch(`/api/auth?code=${code}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={handleSignClick}>Sign in Google</button>
    </div>
  );
}

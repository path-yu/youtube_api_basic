"use client";
import SingGoogleButton from "@/componets/SingGoogleButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
  const [access_token, setToken] = useState("");
  const router = useRouter();
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URI;
  useEffect(() => {
    // 在开发环境下，默认跳转到首页
    const isDev = process.env.NODE_ENV === "development";
    console.log(CLIENT_ID);
    console.log(CLIENT_SECRET);
    console.log(REDIRECT_URL);

    if (isDev) {
      router.push("/home");
    } else {
      if (localStorage.getItem("access_token")) {
        setToken(localStorage.getItem("access_token")!);
        setTimeout(() => {
          router.push("/home");
        }, 200);
      }
    }
  }, []);
  return (
    <div className="flex w-[100vw] h-[100vh] justify-center items-center">
      {access_token ? (
        <div className="text-lg text-gray-300 flex items-center">
          <CircularProgress size="md" />
          <span>loading</span>
        </div>
      ) : (
        <SingGoogleButton></SingGoogleButton>
      )}
    </div>
  );
}

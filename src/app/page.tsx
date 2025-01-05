"use client";
import SingGoogleButton from "@/componets/SingGoogleButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@nextui-org/react";
export default function Home() {
  const access_token = localStorage.getItem("access_token");
  const router = useRouter();

  useEffect(() => {
    if (access_token) {
      router.push("/home");
    }
  }, []);
  return (
    <div className="flex w-[100vw] h-[100vh] justify-center items-center">
      {access_token ? (
        <div className="text-lg text-gray-300 flex items-center">
          <Spinner label="Loading..." size="md" />
        </div>
      ) : (
        <SingGoogleButton></SingGoogleButton>
      )}
    </div>
  );
}

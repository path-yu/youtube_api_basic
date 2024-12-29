"use client";

export default function Home() {
  const handleSignClick = () => {
    fetch("/api/getAuthUrl", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = data.url;
      });
  };
  return (
    <div className="flex w-[100vw] h-[100vh] justify-center items-center">
      <button onClick={handleSignClick}>使用 Google 登录</button>
    </div>
  );
}

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={handleSignClick}>Sign in Google</button>
    </div>
  );
}

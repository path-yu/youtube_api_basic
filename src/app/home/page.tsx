"use server";
import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";
import { headers } from "next/headers";
import mockData from "./mock.json";

import SearchBar from "./SearchBar";
import VideoList from "./VideoList";
export default async function HomePage() {
  const headersList = await headers();
  const url = new URL(headersList.get("x-current-path") as string);

  const code = url.searchParams.get("code");
  if (!code) {
    return (
      <div className="flex justify-center items-center flex-col h-[100vh]">
        <span className="text-red-500">No Code Provided</span>
        <a href="/" className="text-base">
          返回首页
        </a>
      </div>
    );
  }
  try {
    const { tokens } = await oauth2Client.getToken(code!);
    oauth2Client.setCredentials(tokens);
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.search.list({
      part: ["snippet"],
      q: "crypto coin",
      maxResults: 100,
      type: ["video"],
    });
    // 遍历数据列表 渲染视频title, 描述, 发布时间
    return (
      <div>
        <SearchBar></SearchBar>
        <VideoList channel={response.data.items!}></VideoList>;
      </div>
    );
  } catch (error) {
    return (
      <div className="flex justify-center items-center flex-col h-[100vh]">
        <span className="text-red-500">授权失败</span>
        <a href="/" className="text-base">
          返回首页
        </a>
      </div>
    );
  }
}

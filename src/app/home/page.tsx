"use server";
import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";
import { cookies, headers } from "next/headers";
import mockData from "./mock.json";

import SearchBar from "./SearchBar";
import VideoList from "./VideoList";
import AddComment from "./AddComment";
import { YouTubeVideo } from "../types/api";
// const testToken = {
//   access_token:
//     "ya29.a0ARW5m77RiCxlVW5JtqdrgdoVWjEcqW3CArGg8UvzYY5blX6A1dJHm0FSzH7G8-n9RKYvdSUmixCS8eGQfC76zYnXujrveH8Ww21Ggm8SqZGV2f2zDDK6WvYOK8SPJxOcpKvLBg5wgv2IJ712tldhbcmLfaFfYdZoZvVjmsjaaCgYKAc4SARISFQHGX2MizVHgTZkAJNdVuxbf-Zef3A0175",
//   refresh_token:
//     "1//05TZqFuONKh_lCgYIARAAGAUSNwF-L9IrhyBZE0OIcFz8qqds8_4nR80J54Ivq5YE-EwApS0jRlSyKgXoz8ZD2z1xc0TOEpPGLhQ",
//   scope:
//     "https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/drive.readonly",
//   token_type: "Bearer",
//   expiry_date: 1735724483192,
// };

export default async function HomePage() {
  // oauth2Client.setCredentials(testToken);
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");
  const refresh_token = cookieStore.get("refresh_token");
  const expiry_date = cookieStore.get("expiry_date");
  // const access_token =
  //   cookieStore.get("access_token")?.value || testToken.access_token;
  // const refresh_token =
  //   cookieStore.get("refresh_token")?.value || testToken.refresh_token;
  // const expiry_date =
  //   cookieStore.get("expiry_date")?.value || testToken.expiry_date;
  //判断token是否过期
  if (access_token && expiry_date) {
    const now = new Date().getTime();
    if (now > +expiry_date && refresh_token) {
      // 刷新token
      await oauth2Client.refreshAccessToken();
    }
  }
  if (!access_token) {
    return (
      <div className="flex justify-center items-center flex-col h-[100vh]">
        <span className="text-red-500">请先登录</span>
        <a href="/" className="text-base">
          返回首页
        </a>
      </div>
    );
  } else {
    oauth2Client.setCredentials({
      access_token: access_token.value,
      refresh_token: cookieStore.get("refresh_token")!.value,
      expiry_date: +cookieStore.get("expiry_date")!.value,
      token_type: cookieStore.get("token_type")!.value,
      scope: cookieStore.get("scope")!.value,
    });
  }

  try {
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.search.list({
      part: ["snippet"],
      q: "crypto coin",
      maxResults: 100,
      type: ["video"],
    });
    const items = response.data.items as YouTubeVideo[];
    // 遍历数据列表 渲染视频title, 描述, 发布时间
    return (
      <>
        <SearchBar></SearchBar>
        <div className="h-[calc(100vh-92px)] overflow-y-scroll mt-4">
          <VideoList videoList={items}></VideoList>
        </div>
        <AddComment></AddComment>
      </>
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

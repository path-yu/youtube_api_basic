"use server";
import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";
import { cookies } from "next/headers";
import items from "./mock.json";
import SearchBar from "./SearchBar";
import VideoList from "./VideoList";
import AddComment from "./AddComment";
import { YouTubeVideo } from "../types/api";
import Link from "next/link";

// export default async function HomePage() {
//   const cookieStore = await cookies();
//   const access_token = cookieStore.get("access_token");
//   const refresh_token = cookieStore.get("refresh_token");
//   const expiry_date = cookieStore.get("expiry_date");
//   //判断token是否过期
//   if (access_token && expiry_date) {
//     const now = new Date().getTime();
//     if (now > +expiry_date && refresh_token) {
//       // 刷新token
//       await oauth2Client.refreshAccessToken();
//     }
//   }
//   if (!access_token) {
//     return (
//       <div className="flex justify-center items-center flex-col h-[100vh]">
//         <span className="text-red-500">请先登录</span>
//         <a href="/" className="text-base">
//           返回首页
//         </a>
//       </div>
//     );
//   } else {
//     oauth2Client.setCredentials({
//       access_token: access_token.value,
//       refresh_token: cookieStore.get("refresh_token")!.value,
//       expiry_date: +cookieStore.get("expiry_date")!.value,
//       token_type: cookieStore.get("token_type")!.value,
//       scope: cookieStore.get("scope")!.value,
//     });
//   }

//   try {
//     const youtube = google.youtube({ version: "v3", auth: oauth2Client });
//     const response = await youtube.search.list({
//       part: ["snippet"],
//       q: "crypto wallet",
//       maxResults: 100,
//       type: ["video"],
//       order: "date",
//     });
//     const items = response.data.items as YouTubeVideo[];
//     // 遍历数据列表 渲染视频title, 描述, 发布时间
//     return (
//       <>
//         <SearchBar></SearchBar>
//         <div className="h-[calc(100vh-92px)] overflow-y-scroll mt-4">
//           <VideoList videoList={items}></VideoList>
//         </div>
//         <AddComment></AddComment>
//       </>
//     );
//   } catch (error: any) {
//     let message = error.toString() as string;
//     if (
//       message.includes(
//         "The request cannot be completed because you have exceeded your"
//       )
//     ) {
//       message = "Api 调用超出限额";
//     }
//     return (
//       <div className="flex justify-center items-center flex-col h-[100vh]">
//         <span className="text-red-500">{message}</span>
//         <Link href="/" className="text-base">
//           返回首页
//         </Link>
//       </div>
//     );
//   }
// }
export default async function HomePage() {
  return (
    <>
      <SearchBar></SearchBar>
      <div className="h-[calc(100vh-92px)] overflow-y-scroll mt-4">
        <VideoList videoList={items.items}></VideoList>
      </div>
    </>
  );
}

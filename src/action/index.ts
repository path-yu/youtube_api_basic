"use server";
import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";
import { cookies } from "next/headers";

async function searchVideoList(value: string) {
  try {
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.search.list({
      part: ["snippet"],
      q: value,
      type: ["video"],
      order: "date",
      maxResults: 50,
    });
    return response.data.items;
  } catch (error) {
    return [];
  }
}
// 插入评论
async function insertComment(videoId: string, comment: string) {
  console.log(oauth2Client.credentials, "onInsert comment");

  try {
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.commentThreads.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          videoId: videoId,
          topLevelComment: {
            snippet: {
              textOriginal: comment,
            },
          },
        },
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
}
async function logOutAction() {
  const cookie = await cookies();
  // 删除所有cookie
  cookie.delete("access_token");
  cookie.delete("refresh_token");
  cookie.delete("scope");
  cookie.delete("token_type");
  cookie.delete("expiry_date");
}
export { searchVideoList, insertComment, logOutAction };

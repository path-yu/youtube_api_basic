"use server";
import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { Credentials } from "../app/types/api";

async function searchVideoList(value: string) {
  try {
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.search.list({
      part: ["snippet"],
      q: value,
      type: ["video"],
      maxResults: 100,
    });
    return response.data.items;
  } catch (error) {
    return [];
  }
}
async function setCookie(token: Credentials) {
  const cookieStore = await cookies();
  token.access_token;
  cookieStore.set("access_token", token.access_token!);
  cookieStore.set("refresh_token", token.refresh_token!);
  cookieStore.set("scope", token.scope!);
  cookieStore.set("token_type", token.token_type!);
  cookieStore.set("expiry_date", token.expiry_date!.toString());
}
// 插入评论
async function insertComment(videoId: string, comment: string) {
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
    return null;
  }
}

export { searchVideoList, setCookie, insertComment };

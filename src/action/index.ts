"use server";
import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";

async function searchVideoList(value: string) {
  try {
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.search.list({
      part: ["snippet"],
      q: value,
      type: ["video"],
      order: "date",
      maxResults: 100,
    });
    return response.data.items;
  } catch (error) {
    return [];
  }
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
    console.log(error);

    return null;
  }
}

export { searchVideoList, insertComment };

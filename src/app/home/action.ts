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
      maxResults: 100,
    });
    return response.data.items;
  } catch (error) {
    return [];
  }
}
export { searchVideoList };

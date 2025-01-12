import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get("value");
  if (!value) {
    return Response.json({ data: [] });
  }
  try {
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.search.list({
      part: ["snippet"],
      q: value,
      type: ["video"],
      order: "date",
      maxResults: 50,
    });
    return Response.json({ data: response.data.items });
  } catch (error) {
    return Response.json({ data: [] });
  }
}

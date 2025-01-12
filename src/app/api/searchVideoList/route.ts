import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get("value");
  // get body data
  const body = await request.json();
  if (!value) {
    return Response.json({ data: [] });
  }
  if (!oauth2Client.credentials.access_token) {
    oauth2Client.setCredentials({
      ...body,
      expiry_date: +body["expiry_date"],
    });
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

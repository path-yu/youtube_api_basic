import { oauth2Client } from "@/ultis/oauthClient";

// google oauth2 callback 接口
export async function GET(request: Request) {
  //
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    redirect_uri: process.env.REDIRECT_URL,
    client_id: process.env.CLIENT_ID,
    scope: ["  https://www.googleapis.com/auth/youtube.readonly"],
  });
  return Response.json({ url });
}

import { oauth2Client } from "@/utils/oauthClient";

// google oauth2 callback 接口
export async function GET(request: Request) {
  //
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
  });
  return Response.json({ url });
}

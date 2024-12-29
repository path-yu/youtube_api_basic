import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";

export default async function HomePage() {
  const tokens = oauth2Client.credentials;
  // 检查访问令牌是否存在
  if (!tokens.access_token) {
    return <div>请先授权</div>;
  }
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const response = await youtube.channels.list();
  console.log(response.data);

  return <div></div>;
}

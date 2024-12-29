import { oauth2Client } from "@/ultis/oauthClient";
import { google } from "googleapis";
import { headers } from "next/headers";

export default async function HomePage() {
  const headersList = await headers();
  const url = new URL(headersList.get("x-current-path") as string);
  const code = url.searchParams.get("code");
  const { tokens } = await oauth2Client.getToken(code!);
  oauth2Client.setCredentials(tokens);
  console.log(oauth2Client.credentials);

  // const tokens = oauth2Client.credentials;
  // 检查访问令牌是否存在
  if (!tokens.access_token) {
    return <div>请先授权</div>;
  }
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const response = await youtube.channels.list();
  console.log(response.data);

  return <div></div>;
}

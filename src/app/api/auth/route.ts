import { oauth2Client } from "@/ultis/oauthClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url!);
  //code
  const code = searchParams.get("code");
  if (!code) {
    return new Response("No Code provided!", {
      status: 404,
    });
  }
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return new Response("success", {
    status: 200,
    headers: {
      "Set-Cookie": `access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
    },
  });
}

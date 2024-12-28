import { oauth2Client } from "@/ultis/oauthClient";
import { NextResponse } from "next/server";

// google oauth2 callback 接口
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url!);
  //code
  const code = searchParams.get("code");
  if (!code) {
    return new Response("No Code provided!", {
      status: 404,
    });
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // 重定向到首页传入token
    return Response.redirect(`/?access_token=${tokens.access_token}'`);
  } catch (error) {
    return new Response("Error!", {
      status: 500,
    });
  }
}

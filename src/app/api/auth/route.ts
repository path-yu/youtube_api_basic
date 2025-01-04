import { setCookie } from "@/action";
import { oauth2Client } from "@/ultis/oauthClient";
import { NextRequest } from "next/server";

// google oauth2 callback 接口
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const { tokens } = await oauth2Client.getToken(code!);
    setCookie(tokens);
    return Response.json({ success: true });
  } catch (error) {
    console.log(error, "getToken error");
    return Response.json({ success: false });
  }
}

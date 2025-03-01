import { google } from "googleapis";
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oauth2Client.on("tokens", (tokens) => {
  // copy token for test
  console.log(tokens, "onrefreshing");

  // if (tokens.refresh_token) {
  //   oauth2Client.refreshAccessToken();
  // }
});
export { oauth2Client };

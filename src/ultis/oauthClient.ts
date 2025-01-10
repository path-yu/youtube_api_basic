import { google } from "googleapis";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

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

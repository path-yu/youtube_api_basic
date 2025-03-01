export interface Credentials {
  /**
   * This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
   */
  refresh_token: string;
  /**
   * A token that can be sent to a Google API.
   */
  access_token: string;
  /**
   * Identifies the type of token returned. At this time, this field always has the value Bearer.
   */
  token_type: string;
  /**
   * The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
   */
  scope: string;
  expires_in?: number;
}

interface Thumbnails {
  default: {
    url: string;
    width: number;
    height: number;
  };
  medium: {
    url: string;
    width: number;
    height: number;
  };
  high: {
    url: string;
    width: number;
    height: number;
  };
}

interface Snippet {
  channelId: string;
  channelTitle: string;
  description: string;
  liveBroadcastContent: string;
  publishTime: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  title: string;
}

export interface YouTubeVideo {
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  kind: string;
  snippet: Snippet;
}

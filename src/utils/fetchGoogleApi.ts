// lib/fetchGoogleApi.ts
"use client";

import { Credentials } from "@/app/types/api";

// 定义令牌的类型
interface Tokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  scope: string;
  refresh_token_expires_in?: number;
  expires_in?: number;
}

// 定义 fetchGoogleApi 的参数类型
interface FetchGoogleApiOptions {
  endpoint: string; // API 端点，例如 "youtube/v3/search"
  method?: "GET" | "POST" | "PUT" | "DELETE"; // 请求方法，默认 "GET"
  params?: Record<string, string | number | boolean>; // 查询参数
  body?: object; // POST 请求的 body
  customHeaders?: Record<string, string>; // 自定义头
}

const BASE_URL = "https://www.googleapis.com"; // Google API 基础 URL
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

// 从环境变量获取客户端配置（需要在 .env 中以 NEXT_PUBLIC_ 开头）
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET; // 注意安全性，仅用于演示
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

const REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";
// 测试令牌（仅用于本地开发环境）token失效时 localStorage也要进行清空
const testToken: Tokens = {
  access_token:
    "ya29.a0AeXRPp6kJGeKNeh6vBSvmMWM1SmpWxmAuiubcCXKeywM2Nq-v0Xf4mLojATsCwM_Wamdj9qrh_4pevZc7hserIPutZmj6T8XqP3jQRvnNBi5Xdez5vPwj_pcsSQmJmrNv_dG_yqXNBTzp7WeNHNj7O_0YCJA4gfwjr2a1I1uaCgYKAfkSARISFQHGX2MiQkMrzdMhhhHfhD70fWec4w0175",
  refresh_token_expires_in: 604799,
  expires_in: 3599,
  token_type: "Bearer",
  scope:
    "https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly",
  refresh_token:
    "1//04GV4D_fBF6aaCgYIARAAGAQSNwF-L9Irljuydv6rJbviuwZktl4qDTyGMqwVKrKFEfCFQwKq4IKhUwWJ82Nso6a4dgGdUUYV4Us",
};

// 从 localStorage 获取令牌
function getStoredTokens(): Partial<Tokens> {
  return {
    access_token: localStorage.getItem("access_token") || undefined,
    refresh_token: localStorage.getItem("refresh_token") || undefined,
    expires_in: localStorage.getItem("expires_in")
      ? Number(localStorage.getItem("expires_in"))
      : undefined,
    token_type: localStorage.getItem("token_type") || undefined,
    scope: localStorage.getItem("scope") || undefined,
  };
}

// 更新 localStorage 中的令牌
function updateStoredTokens(tokens: Partial<Tokens>): void {
  if (tokens.access_token)
    localStorage.setItem("access_token", tokens.access_token);
  if (tokens.refresh_token) {
    localStorage.setItem("refresh_token", tokens.refresh_token);
  } else {
    const existingRefreshToken = getStoredTokens().refresh_token;
    if (existingRefreshToken)
      localStorage.setItem("refresh_token", existingRefreshToken);
  }
  if (tokens.expires_in)
    localStorage.setItem("expires_in", tokens.expires_in.toString());
  if (tokens.token_type) localStorage.setItem("token_type", tokens.token_type);
  if (tokens.scope) localStorage.setItem("scope", tokens.scope);
}

// 刷新 Access Token
async function refreshAccessToken(refresh_token: string): Promise<string> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID || "",
      client_secret: CLIENT_SECRET || "",
      refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const newTokens: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope: string;
  } = await response.json();

  const updatedTokens: Tokens = {
    access_token: newTokens.access_token,
    refresh_token: newTokens.refresh_token || refresh_token,
    expires_in: Date.now() + newTokens.expires_in * 1000,
    token_type: newTokens.token_type,
    scope: newTokens.scope,
  };

  updateStoredTokens(updatedTokens);
  return updatedTokens.access_token;
}

// 通用的 fetchGoogleApi 方法
export async function fetchGoogleApi({
  endpoint,
  method = "GET",
  params = {},
  body,
  customHeaders = {},
}: FetchGoogleApiOptions): Promise<any> {
  let tokens = getStoredTokens();

  // 在开发环境下，如果没有 access_token，使用 testToken
  const isDev = process.env.NODE_ENV === "development";
  if (isDev && !tokens.access_token) {
    console.warn("Using testToken in development mode");
    tokens = testToken;
    updateStoredTokens(testToken); // 将 testToken 保存到 localStorage，便于调试
  }

  // 如果仍然没有 access_token，抛出错误
  if (!tokens.access_token) {
    throw new Error("No access token found. Please log in.");
  }

  // 检查令牌是否过期并刷新（开发环境跳过刷新，直接用 testToken）
  let currentAccessToken = tokens.access_token;
  if (!isDev && tokens.expires_in && tokens.refresh_token) {
    const now = Date.now();
    if (now > tokens.expires_in) {
      currentAccessToken = await refreshAccessToken(tokens.refresh_token);
    }
  }

  // 构造完整的 URL
  const url = `${BASE_URL}/${endpoint}?${new URLSearchParams(
    params as Record<string, string>
  )}`;

  // 设置默认 headers
  const headers: Record<string, string> = {
    Authorization: `${tokens.token_type || "Bearer"} ${currentAccessToken}`,
    "Content-Type": "application/json",
    ...customHeaders,
  };

  // 配置 fetch 请求
  const config: RequestInit = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }), // 如果有 body，转换为 JSON
  };

  // 发送请求
  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText || "Unknown error";
    if (message.includes("quota")) {
      message = "API 调用超出限额";
    }
    throw new Error(message);
  }

  return response.json(); // 返回解析后的 JSON 数据
}
// 退出登录：撤销令牌并清除本地存储
export async function logout(redirectPath: string = "/"): Promise<void> {
  const tokens = getStoredTokens();

  // 如果有 refresh_token，尝试撤销
  if (tokens.refresh_token) {
    try {
      const response = await fetch(REVOKE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          token: tokens.refresh_token,
        }),
      });

      if (!response.ok) {
        console.warn("Failed to revoke refresh token:", await response.text());
      } else {
        console.log("Refresh token revoked successfully");
      }
    } catch (error) {
      console.error("Error during token revocation:", error);
    }
  }

  // 清除 localStorage 中的所有令牌
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("expires_in");
  localStorage.removeItem("token_type");
  localStorage.removeItem("scope");

  // // 重定向到指定页面（默认是登录页）
  // window.location.href = redirectPath;
}
// 插入评论
export async function insertComment(
  videoId: string,
  comment: string,
  tokens?: Credentials
): Promise<any | null> {
  // 如果提供了 tokens，则使用它；否则从 localStorage 获取
  const currentTokens = tokens || getStoredTokens();
  try {
    const response = await fetchGoogleApi({
      endpoint: "youtube/v3/commentThreads",
      method: "POST",
      params: {
        part: "snippet",
      },
      body: {
        snippet: {
          videoId: videoId,
          topLevelComment: {
            snippet: {
              textOriginal: comment,
            },
          },
        },
      },
      customHeaders: currentTokens.access_token
        ? {
            Authorization: `${currentTokens.token_type || "Bearer"} ${
              currentTokens.access_token
            }`,
          }
        : {}, // 如果已有 token，覆盖 fetchGoogleApi 默认的认证
    });
    return response; // 返回 API 响应数据
  } catch (error) {
    console.log(error);
    return null;
  }
}
// 校验令牌的有效性
export async function validateToken(): Promise<{
  isValid: boolean;
  message: string;
}> {
  const tokens = getStoredTokens();
  const isDev = process.env.NODE_ENV === "development";

  // 在开发环境下，如果没有 access_token，使用 testToken
  if (isDev && !tokens.access_token) {
    console.warn("Using testToken in development mode");
    updateStoredTokens(testToken);
    return { isValid: true, message: "Using test token in development mode." };
  }

  if (!tokens.access_token) {
    return { isValid: false, message: "No access token found. Please log in." };
  }

  const now = Date.now();
  if (tokens.expires_in && now > tokens.expires_in && !tokens.refresh_token) {
    return {
      isValid: false,
      message: "Access token has expired and no refresh token available.",
    };
  }

  let currentAccessToken = tokens.access_token;
  if (tokens.expires_in && now > tokens.expires_in && tokens.refresh_token) {
    try {
      currentAccessToken = await refreshAccessToken(tokens.refresh_token);
    } catch (error: any) {
      return {
        isValid: false,
        message: `Failed to refresh token: ${error.message}`,
      };
    }
  }

  try {
    await fetchGoogleApi({
      endpoint: "oauth2/v3/tokeninfo",
      params: { access_token: currentAccessToken },
    });
    return { isValid: true, message: "Token is valid." };
  } catch (error: any) {
    return {
      isValid: false,
      message: `Token validation failed: ${error.message}`,
    };
  }
}
// 导出工具函数（可选）
export { getStoredTokens, updateStoredTokens };

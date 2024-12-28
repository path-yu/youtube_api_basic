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
    // 重定向到首页传入code
    console.log(process.env.NODE_ENV);

    let url =
      process.env.NODE_ENV == "development"
        ? "http://localhost:3000"
        : "https://youtube-manger-nwpl.vercel.app";
    return Response.redirect(`${url}/?code=${code}'`);
  } catch (error) {
    return new Response("Error!", {
      status: 500,
    });
  }
}

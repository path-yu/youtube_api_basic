import { Innertube } from "youtubei.js";
import { ShortsLockupView, Video } from "youtubei.js/dist/src/parser/nodes";
// google oauth2 callback 接口
export async function GET(request: Request) {
  // 获取查询参数
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const upload_date = searchParams.get("upload_date") || ("all" as any);
  const duration = searchParams.get("duration") || ("all" as any);
  const sort_by = searchParams.get("sort_by") || ("relevance" as any);

  if (!query) {
    //  抛出错误
    return Response.json({ error: "query is required" });
  }
  try {
    const innertube = await Innertube.create(/* options */);
    const search = await innertube.search(query, {
      upload_date,
      duration,
      sort_by,
    });
    //使用set 去重相同的id
    const uniqueIds = new Set();
    let result = search.videos.map((item) => {
      let newItem = {} as any;

      if (item.type === "Video") {
        item = item as Video;
        newItem = {
          id: item.video_id,
          title: item.title.text,
          cover: item.thumbnails[0].url,
          published_at: item.published?.text,
          viewCount: item.view_count?.text,
          duration: item.duration?.text,
        };
        if (uniqueIds.has(newItem.id)) {
          return null;
        }
        uniqueIds.add(newItem.id);
        return newItem;
      } else if (item.type === "ShortsLockupView") {
        item = item as ShortsLockupView;
        newItem = {
          id: item.inline_player_data?.payload.videoId,
          title: item.overlay_metadata.primary_text?.text,
          cover: item.thumbnail[0].url,
          viewCount: item.overlay_metadata.secondary_text?.text,
          duration: null,
          published_at: null,
        };
        if (uniqueIds.has(newItem.id)) {
          return null;
        }
        uniqueIds.add(newItem.id);

        return newItem;
      } else {
        console.log("Unknown type:", item.type, item);
        return null;
      }
    });
    // 过滤掉 null 值
    result = result.filter((item) => item !== null);
    console.log(uniqueIds.size, "uniqueIds", result.length);
    return Response.json(result);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return Response.json({ error: "Failed to fetch search results" });
  }
}

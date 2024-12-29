"use client";
import obverser from "@/ultis/obverser";
import { useEffect, useState } from "react";
import { searchVideoList } from "./action";
export interface VideoListProps {
  channel: any[];
}
const VideoList = (props: VideoListProps) => {
  const [list, setList] = useState<any[]>([]);
  const { channel } = props;
  useEffect(() => {
    obverser.on("search", async (value: any) => {
      console.log(value, "search");
      const result = await searchVideoList(value);
      setList(result!);
    });
  }, []);
  let resultList = channel ? channel : list;
  const listJSX = resultList.map((item, index) => {
    return (
      <div className="px-4 container" key={index}>
        {/* Channel Section */}
        <div className="p-2 mt-4 rounded-lg shadow-md mb-1 bg-gray-900">
          <div className="flex items-center">
            <img
              src={item.snippet.thumbnails.default.url}
              alt="Channel Logo"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white truncate">
                {item.snippet.title}
              </h1>
              <p className="text-gray-600 line-clamp-2">
                {item.snippet.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  });
  return <div className="flex flex-col items-center ">{listJSX}</div>;
};
export default VideoList;

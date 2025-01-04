"use client";
import obverser from "@/ultis/obverser";
import { useEffect, useState } from "react";
import { searchVideoList } from "../../action";
import { Spinner } from "@nextui-org/react";
import useAppStore from "../store";
import { formateNow } from "@/ultis";
// import { Checkbox } from "@nextui-org/react";
import { Progress } from "@nextui-org/progress";
import { Card, CardBody } from "@nextui-org/card";
import { YouTubeVideo } from "../types/api";
export interface VideoListProps {
  videoList: YouTubeVideo[];
}
const VideoList = (props: VideoListProps) => {
  const list = useAppStore((state) => state.videoList);
  const setList = useAppStore((state) => state.setVideoList);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setList(props.videoList);
    obverser.on("search", async (value: any) => {
      setLoading(true);
      const result = await searchVideoList(value);
      setList(result!);
      setLoading(false);
    });
  }, []);
  const resultList = list.length ? list : props.videoList;
  const listJSX = resultList.map((item, index) => {
    return (
      // <Checkbox key={index}>

      // </Checkbox>
      <Card className="mt-4 w-[85vw] md:w-[60vw]" key={index}>
        <CardBody>
          {/* Channel Section */}
          <div className=" rounded-lg ">
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
                <p className="text-gray-500 line-clamp-2">
                  {item.snippet.description}
                </p>
                <p className="text-gray-500 line-clamp-2 text-sm">
                  {formateNow(item.snippet.publishTime)}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  });
  return (
    <div className="flex flex-col items-center ">
      {loading ? (
        <div className="flex items-center h-[40vh]">
          <Spinner size="md" label="Loading..." />
        </div>
      ) : (
        listJSX
      )}
    </div>
  );
};
export default VideoList;

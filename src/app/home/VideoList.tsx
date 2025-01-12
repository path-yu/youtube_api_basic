"use client";
import obverser from "@/ultis/obverser";
import { useEffect, useState } from "react";
import { searchVideoList } from "../../action";
import { Checkbox, CheckboxGroup, cn, Spinner } from "@nextui-org/react";
import useAppStore from "../store";
import { formateNow } from "@/ultis";
import { Card, CardBody } from "@nextui-org/card";
import { YouTubeVideo } from "../types/api";
export interface VideoListProps {
  videoList: YouTubeVideo[];
}
const VideoList = (props: VideoListProps) => {
  const list = useAppStore((state) => state.videoList);
  const setList = useAppStore((state) => state.setVideoList);
  const setSelectedVideoList = useAppStore(
    (state) => state.setSelectedVideoList
  );
  console.log(list, "render");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  // // 是否全选
  const [isAllSelected, setIsAllSelected] = useState(false);
  useEffect(() => {
    setList(props.videoList);
    obverser.on("search", async (value: any) => {
      setLoading(true);
      const result = await searchVideoList(value);
      if (result?.length) {
        setList(result!);
        console.log(result[0].snippet?.title);
      }
      setLoading(false);
    });
  }, []);
  const listJSX = list.map((item, index) => {
    return (
      <Checkbox key={index} value={item.id.videoId}>
        <Card className="mt-4 w-[85vw] md:w-[60vw]">
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
      </Checkbox>
    );
  });
  return (
    <div className="flex flex-col items-center ">
      <div className="flex w-[85vw] md:w-[60vw]">
        <Checkbox
          isSelected={isAllSelected}
          onValueChange={(value) => {
            setIsAllSelected(value);
            if (value) {
              let result = list.map((item) => item.id.videoId);
              setSelected(result);
              setSelectedVideoList(result);
            } else {
              setSelectedVideoList([]);
              setSelected([]);
            }
          }}
        >
          {isAllSelected ? "取消全选" : "全选"}
        </Checkbox>
        <p className="pl-2 text-base text-gray-500">点击选择视频进行评论</p>
      </div>
      {loading ? (
        <div className="flex items-center h-[40vh]">
          <Spinner size="md" label="Loading..." />
        </div>
      ) : (
        <CheckboxGroup
          value={selected}
          onValueChange={(value) => {
            setSelected(value);
            setSelectedVideoList(value);
            if (value.length == list.length) {
              setIsAllSelected(true);
            } else {
              setIsAllSelected(false);
            }
          }}
        >
          {listJSX}
        </CheckboxGroup>
      )}
    </div>
  );
};
export default VideoList;

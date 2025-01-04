import { create } from "zustand";
import { createStore } from "zustand/vanilla";
import { YouTubeVideo } from "../types/api";
type AppStoreStateActions = {
  setVideoList: (videoList: any[]) => void;
  setSearchValue: (searchValue: string) => void;
};
type AppStoreState = {
  videoList: YouTubeVideo[];
  searchValue: string;
  // 是否正在发送评论
  isSendingComment: boolean;
  // 发送评论进度
  commentProgress: number;
};
type AgeStore = AppStoreState & AppStoreStateActions;

const useAppStore = create<AgeStore>((set) => ({
  videoList: [],
  isSendingComment: false,
  commentProgress: 0,
  setVideoList: (videoList) => set({ videoList }),
  searchValue: "",
  setSearchValue: (searchValue) => set({ searchValue }),
}));

export default useAppStore;

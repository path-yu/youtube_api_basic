import { create } from "zustand";
import { YouTubeVideo } from "../types/api";
type AppStoreStateActions = {
  setVideoList: (videoList: any[]) => void;
  setSearchValue: (searchValue: string) => void;
  setSelectedVideoList: (videoList: any[]) => void;
};
type AppStoreState = {
  videoList: YouTubeVideo[];
  searchValue: string;
  selectedVideoList: string[];
};
type AgeStore = AppStoreState & AppStoreStateActions;

const useAppStore = create<AgeStore>((set) => ({
  videoList: [],
  selectedVideoList: [],
  searchValue: "",
  setVideoList: (videoList) => set({ videoList }),
  setSearchValue: (searchValue) => set({ searchValue }),
  setSelectedVideoList: (selectedVideoList) => set({ selectedVideoList }),
}));

export default useAppStore;

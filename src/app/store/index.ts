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
};
type AgeStore = AppStoreState & AppStoreStateActions;

const useAppStore = create<AgeStore>((set) => ({
  videoList: [],
  setVideoList: (videoList) => set({ videoList }),
  searchValue: "",
  setSearchValue: (searchValue) => set({ searchValue }),
}));

export default useAppStore;

// app/store.ts
"use client";

import { create } from "zustand";
import { YouTubeVideo } from "../types/api";

type CommentTemplate = {
  id: string;
  content: string;
};

type AppStoreStateActions = {
  setVideoList: (videoList: YouTubeVideo[]) => void;
  setSearchValue: (searchValue: string) => void;
  setSelectedVideoList: (videoList: string[]) => void;
  addCommentTemplate: (content: string) => void;
  removeCommentTemplate: (id: string) => void;
  updateCommentTemplate: (id: string, content: string) => void;
  initState: () => void;
  setSearchSettings: (settings: Partial<SearchSettings>) => void; // 更新搜索设置
};
type SearchSettings = {
  defaultQuery: string; // 默认搜索关键字
  uploadDate: string; // 上传日期
  duration: string; // 时长
  order: string; // 排序依据
};
type AppStoreState = {
  videoList: YouTubeVideo[];
  searchValue: string;
  selectedVideoList: string[];
  commentTemplates: CommentTemplate[];
  searchSettings: SearchSettings;
};

type AppStore = AppStoreState & AppStoreStateActions;

// localStorage 的键名
const STORAGE_KEY = "commentTemplates";
const SEARCH_SETTINGS_KEY = "searchSettings";
const useAppStore = create<AppStore>((set) => {
  return {
    videoList: [],
    selectedVideoList: [],
    searchValue: "",
    commentTemplates: [], // 使用初始值
    searchSettings: {
      defaultQuery: "crypto wallet", // 默认搜索关键字
      uploadDate: "", // 默认无限制
      duration: "", // 默认无限制
      order: "relevance", // 默认相关性排序
    },
    setVideoList: (videoList) => set({ videoList }),
    setSearchValue: (searchValue) => set({ searchValue }),
    setSelectedVideoList: (selectedVideoList) => set({ selectedVideoList }),
    addCommentTemplate: (content) =>
      set((state) => {
        const newTemplates = [
          ...state.commentTemplates,
          { id: Math.random().toString(36).slice(2), content },
        ];
        // 同步到 localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
        return { commentTemplates: newTemplates };
      }),
    setSearchSettings: (settings: any) => {
      set((state) => {
        let newState = { ...state.searchSettings, ...settings };
        // 同步到 localStorage
        localStorage.setItem(SEARCH_SETTINGS_KEY, JSON.stringify(newState));
        return {
          searchSettings: newState,
        };
      });
    },
    initState: () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const searchSettings = localStorage.getItem(SEARCH_SETTINGS_KEY);
      set({
        commentTemplates: list,
        searchSettings: searchSettings
          ? JSON.parse(searchSettings)
          : {
              defaultQuery: "crypto wallet", // 默认搜索关键字
              uploadDate: "", // 默认无限制
              duration: "", // 默认无限制
              order: "relevance", // 默认相关性排序
            },
      });
    },
    removeCommentTemplate: (id) =>
      set((state) => {
        const newTemplates = state.commentTemplates.filter((t) => t.id !== id);
        // 同步到 localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
        return { commentTemplates: newTemplates };
      }),
    updateCommentTemplate: (id, content) =>
      set((state) => {
        const newTemplates = state.commentTemplates.map((t) =>
          t.id === id ? { ...t, content } : t
        );
        // 同步到 localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
        return { commentTemplates: newTemplates };
      }),
  };
});

export default useAppStore;

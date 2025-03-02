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
  initialCommentTemplates: () => void;
};

type AppStoreState = {
  videoList: YouTubeVideo[];
  searchValue: string;
  selectedVideoList: string[];
  commentTemplates: CommentTemplate[];
};

type AppStore = AppStoreState & AppStoreStateActions;

// localStorage 的键名
const STORAGE_KEY = "commentTemplates";

const useAppStore = create<AppStore>((set) => {
  // 初始化 commentTemplates 从 localStorage 加载
  const initialCommentTemplates = (() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  })();

  return {
    videoList: [],
    selectedVideoList: [],
    searchValue: "",
    commentTemplates: initialCommentTemplates, // 使用初始值
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
    initialCommentTemplates: () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      set({ commentTemplates: list });
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

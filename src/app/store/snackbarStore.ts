// app/snackbarStore.ts
"use client";

import { create } from "zustand";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  setSnackbar: (
    open: boolean,
    message?: string,
    severity?: "success" | "error" | "warning" | "info"
  ) => void;
};

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  severity: "info",
  setSnackbar: (open, message = "", severity = "info") =>
    set({ open, message, severity }),
}));

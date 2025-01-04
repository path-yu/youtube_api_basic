"use client";

import { useEffect } from "react";

export default function ServerAction({ action }: { action: () => void }) {
  useEffect(() => {
    action();
  }, []);

  return <></>;
}

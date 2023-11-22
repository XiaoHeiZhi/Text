"use client";

import { useEffect, useState } from "react";

export default function Dark() {
  const [] = useState(false);
  const updateDarkMode = () => {
    if (typeof window !== "undefined") {
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      if (darkModeMediaQuery.matches) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  };

  useEffect(() => {
    updateDarkMode();
  }, []);

  return <div></div>;
}

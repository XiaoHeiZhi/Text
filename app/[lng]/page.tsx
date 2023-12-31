"use client";

import { useTranslation } from "../i18n";
import { useEffect, useState } from "react";

export default async function Page({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const { t } = await useTranslation(lng);
  const data = await getData();

  return (
    <>
      <h1 className="w-36 text-center text-red-200 inline-block">
        {t("title")}
      </h1>
      <div>{t(data && data.data.name)}</div>
    </>
  );
}

async function getData() {
  const res = await fetch(
    "https://web-yapi.company.druidtech.net/mock/196/test",
    {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Fail to fetch data");
  }

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

  return res.json();
}

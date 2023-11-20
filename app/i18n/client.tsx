"use client";

import { useEffect, useState } from "react";
import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTransLationOrg,
} from "react-i18next";
import { useCookies } from "react-cookie";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getOptions, languages, cookieName } from "./settings";

//判断是在客户端还是服务端
const runsOnServerSide = typeof window === "undefined";

/**
 * 第一个use把i8n给一个实例
 * i18next-browser-languagedetector是i18next库的一个插件，用于在浏览器中检测用户的首选语言（语言偏好，通过检查浏览器的 navigator.language 属性，该插件可以获取用户在浏览器中设置的首选语言。
 * i18next-resources-to-backend是i18next库，用于将i18next的资源数据映射到后端服务（backeend）。它提供了一种方便的方式来将前端的翻译资源同步到后端，以便于在多个环境中共享和管理翻译内容
 */
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: undefined, //让我们在客户端检测语言（表示不指定初始语言,而是使用后续的语言检测机制）
    detection: {
      order: ["path", "htmlTag", "cookie", "navigator"], //部分配置了语言检测的顺序，依次从路径，html标签，cookie，Navigator对象中获取语言信息
    },
    //[]表示在初始化时预加载的语言。如果在服务端执行（`runsOnserverSide`为`true`）,则预加载`languages`中定义的语言资源
    preload: runsOnServerSide ? languages : [],
  });

//这段代码的目的是确保在服务器端和客户端切换语言时，能够正确地更新 cookies 中的语言信息，并在客户端持久化存储用户的语言偏好。在执行 useTranslation Hook 后，你可以获取到 i18n 对象，通过它来处理国际化相关的逻辑。
export function useTranslation(lng: string, ns?: string, options = {}) {
  //useCookies使开发者可以轻松地读取，设置，删除和监听cookies
  const [cookie, setCookie] = useCookies([cookieName]); //获取cookies中名为‘cookieName0’的值
  //通过`useTranslationOrg`获取了ret对象，包含i8对象的数据
  const ret = useTransLationOrg(ns, options);
  const { i18n } = ret;
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    // 如果在服务器执行(runsOnServerSide 为 true),并且指定了新的语言（`lng`）且当前语言与新语言不同的时候，则调用 i18n.changeLanguage(lng) 来切换语言。
    i18n.changeLanguage(lng);
  } else {
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
    useEffect(() => {
      //
      if (activeLng === i18n.resolvedLanguage) return;
      setActiveLng(i18n.resolvedLanguage);
    }, [activeLng, i18n.resolvedLanguage]);
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return;
      i18n.changeLanguage(lng);
    }, [lng, i18n]);
    useEffect(() => {
      if (cookie.i18next === lng) return;
      setCookie(cookieName, lng, { path: "/" });
    }, [lng, cookie.i18next]);
  }
  return ret;
}

export const fallbackLng = "en";
export const languages = [fallbackLng, "de"];
export const defaultNS = "translation";
export const cookieName = "i18next";

// 定义getOptions函数(获取选项函数)
export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}

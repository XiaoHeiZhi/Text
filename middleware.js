import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages, cookieName } from "./app/i18n/settings";

acceptLanguage.languages(languages);

// 匹配项
export const config = {
  // matcher: '/:lng*'
  matcher: ["/((?!api|_next/static|_next/image|assets|favcion.ico|sw.js).*)"],
};

export function middleware(req) {
  let lng;
  if (req.cookies.has(cookieName))
  // 检查根路径/现在将检查是否已经存在最后选择的语言的cooike
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  // 判断req的header有没有Accept-Language接受的语言
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  // 如果请求头没有设置Accept-Language则设置lng为fallbacking
  if (!lng) lng = fallbackLng;

  // 如果路径不支持lng,则重定向
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer"));
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}

import { dir } from "i18next";
import { languages } from "../i18n/settings";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return (
    // lng为语言类型，dir是语言directin缩写，用于设置元素内容的文本方向。该属性接受以下两个可能的值：
    // `ltr`:表示从左到右
    // 'rtl`:表示从右到左`
    <html lang={lng} dir={dir(lng)}>
      <head />
      <body>{children}</body>
    </html>
  );
}

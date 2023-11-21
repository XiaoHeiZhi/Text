import { useTranslation } from "@/app/i18n";
import { languages } from "@/app/i18n/settings";
import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";

export const Footer = async ({ lng }) => {
  const { t } = await useTranslation(lng, "footer");
  return (
    <footer>
      <Trans i18nKey="languageSwitcher" t={t}>
        切换器 Switch from <strong>{lng}</strong> to: {""}
      </Trans>
      {languages
        .filter((l) => l !== lng)
        .map((l, index) => {
          return (
            <span key={l}>
              {index > 0 && " or "}
              <Link href={`/${l}`}>{l}</Link>
            </span>
          );
        })}
    </footer>
  );
};

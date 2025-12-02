"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/styles/404.scss";

const Page404 = memo(() => {
  const router = useRouter();
  const { t } = useTranslation(["errors"]);

  return (
    <div className="wrapper">
      <div className="container">
        <h3>{t("Page not available")}</h3>
        <p>{t("Something went wrong, please try again later.")}</p>

        <button onClick={() => router.push("/")}>{t("Home")}</button>
      </div>
    </div>
  );
});

Page404.displayName = "Page404";

export default Page404;

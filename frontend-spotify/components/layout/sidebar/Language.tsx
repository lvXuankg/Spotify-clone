"use client";

import { Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { languageActions } from "@/store/slices/language";

export const LanguageButton = memo(() => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const currentLanguage = useAppSelector((state) => state.language.current);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        value={currentLanguage}
        onChange={(value) => {
          dispatch(languageActions.setLanguage(value));
          i18n.changeLanguage(value);
        }}
        options={[
          { label: "English", value: "en" },
          { label: "Español", value: "es" },
        ]}
        style={{ width: "100%" }}
      />
    </Space>
  );
});

LanguageButton.displayName = "LanguageButton";

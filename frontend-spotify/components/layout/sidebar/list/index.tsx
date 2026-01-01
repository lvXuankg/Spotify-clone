"use client";

import { Col } from "antd";
import { LibraryTitle } from "../Title";
import { ListItemComponent } from "./ListCards";
import { LibraryFilters, SearchArea } from "../Filters";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getLibraryItems } from "@/store/slices/yourLibrary";
import { memo, useMemo } from "react";
import { isActiveOnOtherDevice } from "@/store/slices/spotify";
import { getLibraryCollapsed, uiActions } from "@/store/slices/ui";
import { LanguageButton } from "../Language";
import { useTranslation } from "react-i18next";

const COLLAPSED_STYLE = {
  overflowY: "scroll",
  height: "100%",
} as const;

const YourLibrary = () => {
  const collapsed = useAppSelector(getLibraryCollapsed);
  const user = useAppSelector((state) => !!state.auth.user);
  const activeOnOtherDevice = useAppSelector(isActiveOnOtherDevice);

  const heightValue = useMemo(() => {
    let value = 310;
    if (!user) value = 270;
    if (collapsed) value = 218;
    if (activeOnOtherDevice) value += 50;
    return value;
  }, [user, collapsed, activeOnOtherDevice]);

  return (
    <div className={`library-section ${!collapsed ? "open" : ""}`}>
      <LibraryTitle />

      {!collapsed && user ? <LibraryFilters /> : null}

      <div className="library-list-container">
        <Col style={collapsed ? {} : COLLAPSED_STYLE}>
          <div
            className="library-list"
            style={{
              overflowY: "scroll",
              overflowX: "hidden",
              height: `calc(100vh - ${heightValue}px)`,
            }}
          >
            {!user ? <AnonymousContent /> : <LoggedContent />}
          </div>

          {!user ? (
            <div style={{ marginLeft: 10 }}>
              <LanguageButton />
            </div>
          ) : null}
        </Col>
      </div>
    </div>
  );
};

const AnonymousContent = () => {
  const { t } = useTranslation(["library"]);
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>{t("Sign in to see your library")}</p>
    </div>
  );
};

const LoggedContent = memo(() => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(getLibraryItems);
  const collapsed = useAppSelector(getLibraryCollapsed);
  const view = useAppSelector((state) => state.yourLibrary.view);

  return (
    <>
      {!collapsed ? <SearchArea /> : null}

      <div className={`${collapsed ? "collapsed" : ""}`}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (window.innerWidth < 900) {
                dispatch(uiActions.collapseLibrary());
              }
            }}
          >
            <ListItemComponent key={item.id} item={item} />
          </div>
        ))}
      </div>
    </>
  );
});

LoggedContent.displayName = "LoggedContent";

export default YourLibrary;

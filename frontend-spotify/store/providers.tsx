"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import { ConfigProvider, App as AntdApp } from "antd";
import { ToasterProvider } from "@/components/providers/ToasterProvider";

interface ProvidersProps {
  children: React.ReactElement;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Monitor redux-persist state changes
    persistor.subscribe(() => {
      const persisted = localStorage.getItem("persist:root");
      console.log(
        "📦 PERSIST STATE CHANGED:",
        persisted ? "✅ persist:root exists" : "❌ persist:root deleted"
      );
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1DB954",
              colorBgBase: "#121212",
              colorTextBase: "#FFFFFF",
            },
          }}
        >
          <AntdApp>
            <ToasterProvider />
            {children}
          </AntdApp>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="mt-4 text-white">Loading...</p>
      </div>
    </div>
  );
}
